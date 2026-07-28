import { useEffect, useMemo, useState } from "react";
import { brands } from "@/data/brands";
import { models } from "@/data/models";
import type { ApplianceCategory } from "@/types";
import { analytics } from "@/utils/analytics";
import { categoryLabels, statusLabels } from "@/utils/labels";
import { searchModels } from "@/utils/searchModels";
import SearchBox from "./SearchBox";

interface Props {
  initialQuery?: string;
}

export default function SearchResults({ initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ApplianceCategory | "all">("all");
  const [brandId, setBrandId] = useState("all");
  const results = useMemo(
    () => searchModels(models, query, { category, brandId }),
    [query, category, brandId],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextQuery = params.get("q") ?? "";
    setQuery(nextQuery);
  }, []);

  useEffect(() => {
    analytics.trackSearch(query, results.length);
    if (query && results.length === 0) analytics.trackNoResult(query);
  }, [query, results.length]);

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
        <h2>{query ? `‘${query}’ 검색 결과` : "전체 모델"}</h2>
        <span>{results.length}개 모델</span>
      </div>
      {results.length > 0 ? (
        <div className="model-grid">
          {results.map(({ model }) => (
            <article className="model-card card" key={model.id}>
              <div className="model-card-top">
                <span className="category-chip">
                  {model.category === "air-purifier" ? "▤" : "◉"} {categoryLabels[model.category]}
                </span>
                <span className={model.isDemo ? "demo-chip" : "official-chip"}>
                  {model.isDemo ? "데모 데이터" : "공식 모델 정보"}
                </span>
              </div>
              <h3>
                <a href={`/model/${model.brandId}/${model.slug}`}>
                  {model.brandName} {model.modelName}
                </a>
              </h3>
              <p className="model-series">
                {model.modelCode}
                {model.series ? ` · ${model.series}` : ""}
              </p>
              <div className="model-card-status">
                <span className={`status-badge status-${model.verificationStatus}`}>
                  ! {statusLabels[model.verificationStatus]}
                </span>
                <span>{model.lastVerifiedAt} 확인</span>
              </div>
              <div className="model-card-footer">
                <strong>호환 소모품 {model.consumableIds.length}개</strong>
                <a className="text-link" href={`/model/${model.brandId}/${model.slug}`}>
                  상세 보기 →
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="empty-state card" role="status">
          <span className="empty-icon" aria-hidden="true">
            ⌕
          </span>
          <h2>검색 결과를 찾지 못했습니다</h2>
          <p>
            모델명의 공백과 하이픈을 제외하고 다시 검색해 보세요. 제품에 부착된 라벨에서 정확한
            모델명을 확인할 수 있습니다.
          </p>
          <div className="button-row">
            <a className="button button-primary" href="/guide/find-model-number">
              모델명 찾는 방법
            </a>
            <button className="button button-secondary" type="button" onClick={() => setQuery("")}>
              전체 모델 보기
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
