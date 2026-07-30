import { useEffect, useMemo, useState } from "react";
import { brands } from "@/data/brands";
import { consumables } from "@/data/consumables";
import { models } from "@/data/models";
import type { ApplianceCategory, ApplianceModel } from "@/types";
import { analytics } from "@/utils/analytics";
import { categoryLabels, partTypeLabels, statusLabels } from "@/utils/labels";
import { getModelDisplayName } from "@/utils/modelDisplayName";
import {
  type CompatibleModelMatch,
  type ConsumableMatchReason,
  searchCatalog,
} from "@/utils/searchCatalog";
import SearchBox from "./SearchBox";

interface Props {
  initialQuery?: string;
}

const matchReasonLabels: Record<ConsumableMatchReason, string> = {
  "part-number": "부품번호 일치",
  "product-name": "상품명 일치",
  "display-name": "소모품명 일치",
  keyword: "검색어 일치",
  type: "소모품 종류 일치",
};

function ModelResultCard({
  model,
  selected,
  onSelect,
  association,
}: {
  model: ApplianceModel;
  selected: boolean;
  onSelect: () => void;
  association?: CompatibleModelMatch;
}) {
  return (
    <article className={`model-card card ${selected ? "is-selected" : ""}`}>
      <div className="model-card-top">
        <span className="category-chip">
          {model.category === "air-purifier" ? "▤" : "◉"} {categoryLabels[model.category]}
        </span>
        <span className="official-chip">
          {association ? "소모품으로 찾은 모델" : "공식 모델 정보"}
        </span>
      </div>
      <p className="model-brand-label">{model.brandName}</p>
      <h3>
        <a href={`/model/${model.brandId}/${model.slug}#compatible-parts`}>
          {getModelDisplayName(model)}
        </a>
      </h3>
      <p className="model-series">
        {model.modelCode}
        {model.series ? ` · ${model.series}` : ""}
      </p>
      {association && (
        <p className="model-match-copy">
          {association.matchedParts
            .slice(0, 2)
            .map((part) => part.displayName)
            .join(" · ")}
          {association.matchedParts.length > 2
            ? ` 외 ${association.matchedParts.length - 2}개`
            : ""}
        </p>
      )}
      <div className="model-card-status">
        <span className={`status-badge status-${model.verificationStatus}`}>
          ✓ {statusLabels[model.verificationStatus]}
        </span>
        <span>{model.lastVerifiedAt} 확인</span>
      </div>
      <div className="model-card-footer">
        <strong>호환 소모품 {model.consumableIds.length}개</strong>
        <button className="text-button" type="button" aria-expanded={selected} onClick={onSelect}>
          {selected ? "소모품 닫기 ↑" : "소모품 바로 보기 ↓"}
        </button>
      </div>
    </article>
  );
}

export default function SearchResults({ initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ApplianceCategory | "all">("all");
  const [brandId, setBrandId] = useState("all");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const results = useMemo(
    () =>
      searchCatalog(models, consumables, query, {
        category,
        brandId,
        consumableLimit: 30,
      }),
    [query, category, brandId],
  );
  const selectedModel = models.find((model) => model.id === selectedModelId);
  const selectedParts = selectedModel
    ? selectedModel.consumableIds
        .map((id) => consumables.find((part) => part.id === id))
        .filter((part) => part !== undefined)
    : [];
  const totalResults =
    results.models.length + results.consumables.length + results.compatibleModels.length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? "");
  }, []);

  useEffect(() => {
    setSelectedModelId(null);
  }, [query, category, brandId]);

  useEffect(() => {
    analytics.trackSearch(query, totalResults);
    if (query && totalResults === 0) analytics.trackNoResult(query);
  }, [query, totalResults]);

  const selectModel = (modelId: string) => {
    setSelectedModelId((current) => (current === modelId ? null : modelId));
    window.setTimeout(() => {
      document.getElementById("selected-model-consumables")?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 0);
  };

  return (
    <div className="search-page-app">
      <SearchBox initialQuery={query} compact />
      <div className="filter-bar" aria-label="검색 결과 필터">
        <label>
          <span>카테고리</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as ApplianceCategory | "all")}
          >
            <option value="all">전체 카테고리</option>
            <option value="air-purifier">공기청정기</option>
            <option value="robot-vacuum">로봇청소기</option>
          </select>
        </label>
        <label>
          <span>브랜드</span>
          <select value={brandId} onChange={(event) => setBrandId(event.target.value)}>
            <option value="all">전체 브랜드</option>
            {brands.map((brand) => (
              <option value={brand.id} key={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="results-heading" aria-live="polite">
        <h2>{query ? `‘${query}’ 통합검색` : "전체 모델"}</h2>
        <span>
          {query
            ? `모델 ${results.models.length + results.compatibleModels.length} · 소모품 ${
                results.consumables.length
              }`
            : `${results.models.length}개 모델`}
        </span>
      </div>

      {totalResults > 0 ? (
        <div className="search-result-groups">
          {results.models.length > 0 && (
            <section className="result-group" aria-labelledby="model-results-heading">
              <div className="result-group-heading">
                <div>
                  <span className="eyebrow">모델 결과</span>
                  <h2 id="model-results-heading">
                    {query ? "모델명과 모델번호가 일치합니다" : "등록된 전체 모델"}
                  </h2>
                </div>
                <span>{results.models.length}개</span>
              </div>
              <div className="model-grid">
                {results.models.map(({ model }) => (
                  <ModelResultCard
                    model={model}
                    selected={selectedModelId === model.id}
                    onSelect={() => selectModel(model.id)}
                    key={model.id}
                  />
                ))}
              </div>
            </section>
          )}

          {selectedModel && (
            <section
              className="selected-model-consumables card"
              id="selected-model-consumables"
              aria-labelledby="selected-model-heading"
            >
              <div className="selected-model-heading">
                <div>
                  <span className="eyebrow">선택한 모델의 공식 호환 정보</span>
                  <h2 id="selected-model-heading">
                    {selectedModel.brandName} {selectedModel.modelCode} 소모품
                  </h2>
                </div>
                <a
                  className="text-link"
                  href={`/model/${selectedModel.brandId}/${selectedModel.slug}#compatible-parts`}
                >
                  모델 상세에서 보기 →
                </a>
              </div>
              {selectedParts.length > 0 ? (
                <div className="selected-parts-grid">
                  {selectedParts.map((part) => (
                    <a className="selected-part-item" href={`/part/${part.slug}`} key={part.id}>
                      <span className="official-chip">공식 호환 확인</span>
                      <strong>{part.displayName}</strong>
                      <small>
                        {partTypeLabels[part.type]} · {part.genuinePartNumber ?? "부품번호 미등록"}
                      </small>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="empty-inline">현재 연결된 공식 소모품을 조사 중입니다.</p>
              )}
            </section>
          )}

          {results.consumables.length > 0 && (
            <section className="result-group" aria-labelledby="part-results-heading">
              <div className="result-group-heading">
                <div>
                  <span className="eyebrow">소모품 결과</span>
                  <h2 id="part-results-heading">상품명과 부품번호가 일치합니다</h2>
                </div>
                <span>{results.consumables.length}개</span>
              </div>
              <div className="search-part-grid">
                {results.consumables.map(({ part, reason }) => {
                  const compatibleModels = part.compatibleModelIds
                    .map((id) => models.find((model) => model.id === id))
                    .filter((model) => model !== undefined);

                  return (
                    <article className="search-part-card card" key={part.id}>
                      <div className="search-part-card-top">
                        <span className="category-chip">{partTypeLabels[part.type]}</span>
                        <span className="match-reason">{matchReasonLabels[reason]}</span>
                      </div>
                      <h3>
                        <a href={`/part/${part.slug}`}>{part.displayName}</a>
                      </h3>
                      <p className="model-code">
                        {part.genuinePartNumber ?? "공개된 정품 부품번호 없음"}
                      </p>
                      <div className="compatible-model-links">
                        <strong>공식 호환 모델</strong>
                        <div>
                          {compatibleModels.slice(0, 5).map((model) => (
                            <a
                              href={`/model/${model.brandId}/${model.slug}#compatible-parts`}
                              key={model.id}
                            >
                              {model.brandName} {model.modelCode}
                            </a>
                          ))}
                          {compatibleModels.length > 5 && (
                            <span>외 {compatibleModels.length - 5}개</span>
                          )}
                        </div>
                      </div>
                      <a className="text-link" href={`/part/${part.slug}`}>
                        호환 근거와 구매 정보 보기 →
                      </a>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {results.compatibleModels.length > 0 && (
            <section className="result-group" aria-labelledby="compatible-models-heading">
              <div className="result-group-heading">
                <div>
                  <span className="eyebrow">소모품으로 찾은 모델</span>
                  <h2 id="compatible-models-heading">이 소모품과 공식 연결된 모델입니다</h2>
                </div>
                <span>{results.compatibleModels.length}개</span>
              </div>
              <div className="model-grid">
                {results.compatibleModels.map((association) => (
                  <ModelResultCard
                    model={association.model}
                    association={association}
                    selected={selectedModelId === association.model.id}
                    onSelect={() => selectModel(association.model.id)}
                    key={association.model.id}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <section className="empty-state card" role="status">
          <span className="empty-icon" aria-hidden="true">
            ⌕
          </span>
          <h2>검색 결과를 찾지 못했습니다</h2>
          <p>
            모델번호, 소모품 상품명 또는 정품 부품번호를 확인해 다시 검색해 보세요. 확인되지 않은
            호환 관계는 임의로 표시하지 않습니다.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="/guide/find-model-number">
              모델명 찾는 방법
            </a>
            <a className="button button-secondary" href="/find">
              전체 모델 보기
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
