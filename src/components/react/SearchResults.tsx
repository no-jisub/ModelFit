import { useEffect, useMemo, useState } from "react";
import { brands } from "@/data/brands";
import { categories, isApplianceCategory } from "@/data/categories";
import type { ApplianceCategory } from "@/types";
import type { SearchModel, SearchConsumable, SearchCatalogData } from "@/utils/searchData";
import { hasOfficialCompatibility } from "@/utils/searchData";
import { summarizeCompatibility } from "@/utils/compatibility";
import { analytics } from "@/utils/analytics";
import {
  categoryLabels,
  getPartNumberStatus,
  partNumberStatusLabels,
  partTypeLabels,
} from "@/utils/labels";
import { getModelDisplayName } from "@/utils/modelDisplayName";
import {
  type CompatibleModelMatch,
  type ConsumableMatchReason,
  searchCatalog,
  preferredSearchTab,
  splitStrongMatches,
} from "@/utils/searchCatalog";
import SearchBox from "./SearchBox";
import "@/styles/search-results.css";

interface Props {
  catalog: SearchCatalogData;
  initialQuery?: string;
}

type SearchTab = "models" | "parts";

const MODEL_PAGE_SIZE = 12;
const PART_PAGE_SIZE = 12;

const matchReasonLabels: Record<ConsumableMatchReason, string> = {
  "part-number": "부품번호 일치",
  "product-name": "상품명 일치",
  "display-name": "소모품명 일치",
  keyword: "검색어 일치",
  type: "소모품 종류 일치",
};

function ModelResultCard({
  consumables,
  model,
  selected,
  onSelect,
  association,
}: {
  consumables: SearchConsumable[];
  model: SearchModel;
  selected: boolean;
  onSelect: () => void;
  association?: CompatibleModelMatch;
}) {
  const modelParts = model.consumableIds
    .map((id) => consumables.find((part) => part.id === id))
    .filter((part) => part !== undefined);
  const panelId = `model-parts-${model.id}`;
  const summary = summarizeCompatibility(modelParts, model.id);

  return (
    <article className={`model-card card ${selected ? "is-selected" : ""}`}>
      <div className="model-card-top">
        <span className="category-chip">{categoryLabels[model.category]}</span>
        {association && <span className="official-chip">소모품으로 찾은 모델</span>}
      </div>
      {model.image && (
        <div className="model-card-image">
          <img
            src={model.image.src}
            alt={model.image.alt}
            width={720}
            height={720}
            loading="lazy"
          />
        </div>
      )}
      <p className="model-brand-label">{model.brandName}</p>
      <h3>{getModelDisplayName(model)}</h3>
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

      <div className="model-card-footer">
        <div className="compatibility-summary">
          <strong>등록 부품 {summary.registered}개</strong>
          <small>
            공식 호환 확인 {summary.confirmed}개 · 확인 필요 {summary.needsReview}개
          </small>
        </div>
        <button
          className="text-button"
          type="button"
          aria-expanded={selected}
          aria-controls={panelId}
          onClick={onSelect}
        >
          {selected ? "호환 소모품 닫기 ↑" : "호환 소모품 확인 ↓"}
        </button>
      </div>
      {selected && (
        <section
          className="model-inline-consumables"
          id={panelId}
          aria-label={`${model.brandName} ${model.modelCode} 모델별 소모품`}
        >
          <div className="model-inline-heading">
            <div>
              <span className="eyebrow">모델별 소모품</span>
              <strong>{modelParts.length}개가 연결되어 있습니다</strong>
            </div>
          </div>
          {modelParts.length > 0 ? (
            <div className="model-inline-parts">
              {modelParts.map((part) => (
                <a
                  className="model-inline-part"
                  href={`/model/${model.brandId}/${model.slug}#${part.id}`}
                  data-search-model-id={model.id}
                  key={part.id}
                >
                  <span>
                    <strong>{part.displayName}</strong>
                    <small>
                      {partTypeLabels[part.type]} · {part.genuinePartNumber ?? "부품번호 정보 없음"}
                      {" · "}
                      {hasOfficialCompatibility(part, model.id)
                        ? "공식 호환 확인"
                        : "호환 확인 필요"}
                    </small>
                  </span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="empty-inline">현재 연결된 소모품을 조사 중입니다.</p>
          )}
        </section>
      )}
    </article>
  );
}

function PartResultCard({
  models,
  part,
  reason,
}: {
  models: SearchModel[];
  part: SearchConsumable;
  reason: ConsumableMatchReason;
}) {
  const compatibleModels = part.compatibleModelIds
    .map((id) => models.find((model) => model.id === id))
    .filter((model) => model !== undefined);

  return (
    <article className="search-part-card card" id={`part-${part.id}`}>
      <div className="search-part-card-top">
        <span className="category-chip">{partTypeLabels[part.type]}</span>
        <span className="match-reason">{matchReasonLabels[reason]}</span>
      </div>
      <h3>{part.displayName}</h3>
      <p className="model-code">{part.genuinePartNumber ?? "정보 없음"}</p>
      <span
        className={`part-number-badge is-${getPartNumberStatus(part.genuinePartNumber, part.partNumberStatus)}`}
      >
        <span aria-hidden="true">{part.genuinePartNumber ? "✓" : "—"}</span>
        {partNumberStatusLabels[getPartNumberStatus(part.genuinePartNumber, part.partNumberStatus)]}
      </span>
      <details className="compatible-model-links">
        <summary>연결 모델 {compatibleModels.length}개 보기</summary>
        {compatibleModels.length > 0 ? (
          <div>
            {compatibleModels.map((model) => (
              <a
                href={`/model/${model.brandId}/${model.slug}#${part.id}`}
                data-search-model-id={model.id}
                key={model.id}
              >
                {model.brandName} {model.modelCode}
                <small>
                  {" "}
                  · {hasOfficialCompatibility(part, model.id) ? "공식 호환 확인" : "호환 확인 필요"}
                </small>
              </a>
            ))}
          </div>
        ) : (
          <p>연결된 호환 모델을 확인 중입니다.</p>
        )}
      </details>
    </article>
  );
}

export default function SearchResults({
  initialQuery = "",
  catalog: { models, consumables },
}: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ApplianceCategory | "all">("all");
  const [brandId, setBrandId] = useState("all");
  const [tabPreference, setTabPreference] = useState<SearchTab | null>(null);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [visibleModelCount, setVisibleModelCount] = useState(MODEL_PAGE_SIZE);
  const [visiblePartCount, setVisiblePartCount] = useState(PART_PAGE_SIZE);
  const [visibleRelatedPartCount, setVisibleRelatedPartCount] = useState(PART_PAGE_SIZE);
  const results = useMemo(
    () =>
      searchCatalog(models, consumables, query, {
        category,
        brandId,
      }),
    [models, consumables, query, category, brandId],
  );
  const totalResults =
    results.totals.models + results.totals.consumables + results.totals.compatibleModels;
  const modelResultCount = results.totals.models + results.totals.compatibleModels;
  const partResultCount = results.totals.consumables;
  const modelMatches = splitStrongMatches(results.models);
  const visibleModelMatches = modelMatches.primary.slice(0, visibleModelCount);
  const consumableMatches = splitStrongMatches(results.consumables);
  const preferredTab = preferredSearchTab(query, models, results);
  const activeTab = tabPreference ?? preferredTab;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get("category");
    const nextBrandId = params.get("brand");

    setQuery(params.get("q") ?? "");
    setCategory(isApplianceCategory(nextCategory) ? nextCategory : "all");
    setBrandId(nextBrandId && brands.some(({ id }) => id === nextBrandId) ? nextBrandId : "all");
    const nextTab = params.get("type");
    setTabPreference(nextTab === "models" || nextTab === "parts" ? nextTab : null);
    setUrlStateReady(true);
  }, []);

  useEffect(() => {
    setSelectedModelId(null);
    setVisibleModelCount(MODEL_PAGE_SIZE);
    setVisiblePartCount(PART_PAGE_SIZE);
    setVisibleRelatedPartCount(PART_PAGE_SIZE);
  }, [query, category, brandId]);

  useEffect(() => {
    if (!urlStateReady) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("category", category);
    if (brandId !== "all") params.set("brand", brandId);
    params.set("type", activeTab);
    const nextUrl = params.size > 0 ? `/find?${params.toString()}` : "/find";
    window.history.replaceState(null, "", nextUrl);
  }, [query, category, brandId, activeTab, urlStateReady]);

  useEffect(() => {
    if (!urlStateReady || !query.trim()) return;
    const timeoutId = window.setTimeout(() => {
      analytics.trackSearch(query, totalResults, {
        model_count: modelResultCount,
        part_count: partResultCount,
        category,
        brand_id: brandId,
      });
      if (totalResults === 0) analytics.trackNoResult(query);
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [query, totalResults, urlStateReady, modelResultCount, partResultCount, category, brandId]);

  const selectModel = (modelId: string) => {
    setSelectedModelId((current) => (current === modelId ? null : modelId));
  };

  return (
    <div className="search-page-app" data-ready={urlStateReady ? "true" : "false"}>
      <SearchBox initialQuery={query} compact />
      <div className="filter-bar" aria-label="검색 결과 필터">
        <label>
          <span>카테고리</span>
          <select
            aria-label="카테고리"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as ApplianceCategory | "all");
              setTabPreference(null);
            }}
          >
            <option value="all">전체 카테고리</option>
            {categories.map((item) => (
              <option value={item.id} key={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>브랜드</span>
          <select
            aria-label="브랜드"
            value={brandId}
            onChange={(event) => {
              setBrandId(event.target.value);
              setTabPreference(null);
            }}
          >
            <option value="all">전체 브랜드</option>
            {brands.map((brand) => (
              <option value={brand.id} key={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {(category !== "all" || brandId !== "all") && (
        <button
          className="text-button filter-reset"
          type="button"
          onClick={() => {
            setCategory("all");
            setBrandId("all");
          }}
        >
          필터 전체 해제
        </button>
      )}

      <p className="results-summary" aria-live="polite">
        검색 결과 {activeTab === "models" ? modelResultCount : partResultCount}개
      </p>

      {totalResults > 0 ? (
        <div>
          <div className="search-tabs" role="tablist" aria-label="검색 결과 종류">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "models"}
              aria-controls="model-results-panel"
              id="model-results-tab"
              onClick={() => setTabPreference("models")}
            >
              모델 <span aria-hidden="true">{modelResultCount}개</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "parts"}
              aria-controls="part-results-panel"
              id="part-results-tab"
              onClick={() => setTabPreference("parts")}
            >
              소모품 <span aria-hidden="true">{partResultCount}개</span>
            </button>
          </div>

          {activeTab === "models" ? (
            <div
              className="search-result-groups"
              role="tabpanel"
              id="model-results-panel"
              aria-labelledby="model-results-tab"
            >
              {modelMatches.primary.length > 0 && (
                <section className="result-group" aria-label="모델 검색 결과">
                  {query && (
                    <div className="result-group-heading">
                      <h2>일치하는 모델</h2>
                    </div>
                  )}
                  <div className="model-grid">
                    {visibleModelMatches.map(({ model }) => (
                      <ModelResultCard
                        consumables={consumables}
                        model={model}
                        selected={selectedModelId === model.id}
                        onSelect={() => selectModel(model.id)}
                        key={model.id}
                      />
                    ))}
                  </div>
                  {visibleModelMatches.length < modelMatches.primary.length && (
                    <div className="search-load-more">
                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={() => setVisibleModelCount((count) => count + MODEL_PAGE_SIZE)}
                      >
                        모델 더 보기
                      </button>
                    </div>
                  )}
                </section>
              )}

              {results.compatibleModels.length > 0 && (
                <section className="result-group" aria-labelledby="compatible-models-heading">
                  <div className="result-group-heading">
                    <h2 id="compatible-models-heading">소모품과 연결된 모델</h2>
                  </div>
                  <div className="model-grid">
                    {results.compatibleModels.map((association) => (
                      <ModelResultCard
                        consumables={consumables}
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

              {modelResultCount === 0 && (
                <p className="tab-empty-state">
                  일치하는 모델이 없습니다. 소모품 탭을 확인해 보세요.
                </p>
              )}

              {modelMatches.related.length > 0 && (
                <details
                  className="related-results"
                  onToggle={(event) =>
                    analytics.trackRelatedResults(
                      event.currentTarget.open,
                      modelMatches.related.length,
                      0,
                    )
                  }
                >
                  <summary>
                    관련 모델 더 보기 <span>{modelMatches.related.length}개</span>
                  </summary>
                  <div className="related-result-groups">
                    <div className="model-grid">
                      {modelMatches.related.map(({ model }) => (
                        <ModelResultCard
                          consumables={consumables}
                          model={model}
                          selected={selectedModelId === model.id}
                          onSelect={() => selectModel(model.id)}
                          key={model.id}
                        />
                      ))}
                    </div>
                  </div>
                </details>
              )}
            </div>
          ) : (
            <div
              className="search-result-groups"
              role="tabpanel"
              id="part-results-panel"
              aria-labelledby="part-results-tab"
            >
              {consumableMatches.primary.length > 0 ? (
                <section className="result-group" aria-labelledby="part-results-heading">
                  <div className="result-group-heading">
                    <h2 id="part-results-heading">일치하는 소모품</h2>
                  </div>
                  <div className="search-part-grid">
                    {consumableMatches.primary
                      .slice(0, visiblePartCount)
                      .map(({ part, reason }) => (
                        <PartResultCard models={models} part={part} reason={reason} key={part.id} />
                      ))}
                  </div>
                  <p className="result-page-count" aria-live="polite">
                    일치 결과 {consumableMatches.primary.length}개 중{" "}
                    {Math.min(visiblePartCount, consumableMatches.primary.length)}개 표시
                  </p>
                  {visiblePartCount < consumableMatches.primary.length && (
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => setVisiblePartCount((count) => count + PART_PAGE_SIZE)}
                    >
                      소모품 더 보기
                    </button>
                  )}
                </section>
              ) : (
                <p className="tab-empty-state">
                  일치하는 소모품이 없습니다. 모델 탭을 확인해 보세요.
                </p>
              )}

              {consumableMatches.related.length > 0 && (
                <details
                  className="related-results"
                  onToggle={(event) =>
                    analytics.trackRelatedResults(
                      event.currentTarget.open,
                      0,
                      consumableMatches.related.length,
                    )
                  }
                >
                  <summary>
                    관련 소모품 더 보기 <span>{consumableMatches.related.length}개</span>
                  </summary>
                  <div className="related-result-groups">
                    <div className="search-part-grid">
                      {consumableMatches.related
                        .slice(0, visibleRelatedPartCount)
                        .map(({ part, reason }) => (
                          <PartResultCard
                            models={models}
                            part={part}
                            reason={reason}
                            key={part.id}
                          />
                        ))}
                    </div>
                    <p className="result-page-count" aria-live="polite">
                      관련 결과 {consumableMatches.related.length}개 중{" "}
                      {Math.min(visibleRelatedPartCount, consumableMatches.related.length)}개 표시
                    </p>
                    {visibleRelatedPartCount < consumableMatches.related.length && (
                      <button
                        className="button button-secondary"
                        type="button"
                        onClick={() =>
                          setVisibleRelatedPartCount((count) => count + PART_PAGE_SIZE)
                        }
                      >
                        관련 소모품 더 불러오기
                      </button>
                    )}
                  </div>
                </details>
              )}
            </div>
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
              검색 초기화
            </a>
            <a
              className="button button-secondary"
              href={`/report?${new URLSearchParams({ model: query, page: `/find?q=${encodeURIComponent(query)}` })}`}
            >
              모델 등록 요청
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
