import { useEffect, useMemo, useState } from "react";
import { models } from "@/data/models";
import {
  APPLIANCE_STORAGE_EVENT,
  readSavedAppliances,
  writeSavedAppliances,
} from "@/utils/applianceStorage";
import { categoryLabels } from "@/utils/labels";

export default function MyAppliances() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSavedIds(readSavedAppliances().map((item) => item.modelId));
      setReady(true);
    };

    sync();
    window.addEventListener(APPLIANCE_STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(APPLIANCE_STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedModels = useMemo(
    () =>
      savedIds
        .map((id) => models.find((model) => model.id === id))
        .filter((model) => model !== undefined),
    [savedIds],
  );

  if (!ready) {
    return <div className="cabinet-loading card">내 가전 정보를 불러오는 중입니다.</div>;
  }

  if (savedModels.length === 0) {
    return (
      <section className="empty-state card" role="status">
        <span className="empty-icon" aria-hidden="true">
          +
        </span>
        <h2>아직 등록한 가전이 없습니다</h2>
        <p>모델을 검색한 뒤 상세 페이지에서 ‘내 가전함에 추가’를 누르세요.</p>
        <div className="button-row">
          <a className="button button-primary" href="/find">
            내 모델 찾기
          </a>
        </div>
      </section>
    );
  }

  return (
    <div className="cabinet-grid">
      {savedModels.map((model) => (
        <article className="cabinet-card card" key={model.id}>
          <div>
            <span className="category-chip">{categoryLabels[model.category]}</span>
            <h2>
              <a href={`/model/${model.brandId}/${model.slug}`}>
                {model.brandName} {model.modelName}
              </a>
            </h2>
            <p className="model-code">{model.modelCode}</p>
            <p>{model.shortDescription}</p>
          </div>
          <div className="cabinet-card-footer">
            <span>연결된 소모품 {model.consumableIds.length}개</span>
            <div className="button-row">
              <a className="button button-primary" href={`/model/${model.brandId}/${model.slug}`}>
                소모품 보기
              </a>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  const next = readSavedAppliances().filter((item) => item.modelId !== model.id);
                  writeSavedAppliances(next);
                  setSavedIds(next.map((item) => item.modelId));
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
