import { useEffect, useMemo, useState } from "react";
import { brands } from "@/data/brands";
import { consumables } from "@/data/consumables";
import { models } from "@/data/models";
import type { ApplianceCategory, ApplianceModel } from "@/types";
import { analytics } from "@/utils/analytics";
import {
  categoryLabels,
  getPartNumberStatus,
  getVerificationLabel,
  partNumberStatusLabels,
  partTypeLabels,
} from "@/utils/labels";
import { getModelDisplayName } from "@/utils/modelDisplayName";
import {
  type CompatibleModelMatch,
  type ConsumableMatchReason,
  searchCatalog,
  splitStrongMatches,
} from "@/utils/searchCatalog";
import SearchBox from "./SearchBox";

interface Props {
  initialQuery?: string;
}

type SearchTab = "models" | "parts";

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
  const modelParts = model.consumableIds
    .map((id) => consumables.find((part) => part.id === id))
    .filter((part) => part !== undefined);
  const panelId = `model-parts-${model.id}`;

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
      <div className="model-card-status">
        <span className={`status-badge status-${model.verificationStatus}`}>
          ✓ {getVerificationLabel(model.verificationStatus, "model")}
        </span>
        <span>{model.lastVerifiedAt} 확인</span>
      </div>
      <div className="model-card-footer">
        <strong>호환 소모품 {model.consumableIds.length}개</strong>
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
          aria-label={`${model.brandName} ${model.modelCode} 공식 호환 소모품`}
        >
          <div className="model-inline-heading">
            <div>
              <span className="eyebrow">공식 호환 소모품</span>
              <strong>{modelParts.length}개가 연결되어 있습니다</strong>
            </div>
          </div>
          {modelParts.length > 0 ? (
            <div className="model-inline-parts">
              {modelParts.map((part) => (
                <a className="model-inline-part" href={`/part/${part.slug}`} key={part.id}>
                  <span>
                    <strong>{part.displayName}</strong>
                    <small>
                      {partTypeLabels[part.type]} · {part.genuinePartNumber ?? "부품번호 정보 없음"}
                    </small>
                  </span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="empty-inline">현재 연결된 공식 소모품을 조사 중입니다.</p>
          )}
        </section>
      )}
    </article>
  );
}

function PartResultCard({
  part,
  reason,
  showCompatibleModels = true,
}: {
  part: (typeof consumables)[number];
  reason: ConsumableMatchReason;
  showCompatibleModels?: boolean;
}) {
  const compatibleModels = part.compatibleModelIds
    .map((id) => models.find((model) => model.id === id))
    .filter((model) => model !== undefined);

  return (
    <article className="search-part-card card">
      <div className="search-part-card-top">
        <span className="category-chip">{partTypeLabels[part.type]}</span>
        <span className="match-reason">{matchReasonLabels[reason]}</span>
      </div>
      <h3>
        <a href={`/part/${part.slug}`}>{part.displayName}</a>
      </h3>
      <p className="model-code">{part.genuinePartNumber ?? "정보 없음"}</p>
      <span
        className={`part-number-badge is-${getPartNumberStatus(part.genuinePartNumber, part.partNumberStatus)}`}
      >
        <span aria-hidden="true">{part.genuinePartNumber ? "✓" : "—"}</span>
        {partNumberStatusLabels[getPartNumberStatus(part.genuinePartNumber, part.partNumberStatus)]}
      </span>
      {showCompatibleModels && (
        <div className="compatible-model-links">
          <strong>공식 호환 모델</strong>
          <div>
            {compatibleModels.slice(0, 5).map((model) => (
              <a href={`/model/${model.brandId}/${model.slug}#compatible-parts`} key={model.id}>
                {model.brandName} {model.modelCode}
              </a>
            ))}
            {compatibleModels.length > 5 && <span>외 {compatibleModels.length - 5}개</span>}
          </div>
        </div>
      )}
      <a className="text-link" href={`/part/${part.slug}`}>
        호환 근거와 구매 정보 보기 →
      </a>
    </article>
  );
}

export default function SearchResults({ initialQuery = "" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<ApplianceCategory | "all">("all");
  const [brandId, setBrandId] = useState("all");
  const [tabPreference, setTabPreference] = useState<SearchTab | null>(null);
  const [urlStateReady, setUrlStateReady] = useState(false);
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
  const totalResults =
    results.models.length + results.consumables.length + results.compatibleModels.length;
  const modelResultCount = results.models.length + results.compatibleModels.length;
  const partResultCount = results.consumables.length;
  const modelMatches = splitStrongMatches(results.models);
  const consumableMatches = splitStrongMatches(results.consumables);
  const preferredTab: SearchTab =
    query.trim() &&
    partResultCount > 0 &&
    (modelResultCount === 0 ||
      (results.consumables[0]?.score ?? 0) > (results.models[0]?.score ?? 0))
      ? "parts"
      : "models";
  const activeTab = tabPreference ?? preferredTab;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get("category");
    const nextBrandId = params.get("brand");

    setQuery(params.get("q") ?? "");
    setCategory(
      nextCategory === "air-purifier" || nextCategory === "robot-vacuum" ? nextCategory : "all",
    );
    setBrandId(nextBrandId && brands.some(({ id }) => id === nextBrandId) ? nextBrandId : "all");
    const nextTab = params.get("type");
    setTabPreference(nextTab === "models" || nextTab === "parts" ? nextTab : null);
    setUrlStateReady(true);
  }, []);

  useEffect(() => {
    setSelectedModelId(null);
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
      analytics.trackSearch(query, totalResults);
      if (totalResults === 0) analytics.trackNoResult(query);
    }, 500);
    return () => window.clearTimeout(timeoutId);
  }, [query, totalResults, urlStateReady]);

  const selectModel = (modelId: string) => {
    setSelectedModelId((current) => (current === modelId ? null : modelId));
  };

  return (
    <div className="search-page-app">
      <SearchBox initialQuery={query} compact />
      <div className="filter-bar" aria-label="검색 결과 필터">
        <label>
          <span>카테고리</span>
          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value as ApplianceCategory | "all");
              setTabPreference(null);
            }}
          >
            <option value="all">전체 카테고리</option>
            <option value="air-purifier">공기청정기</option>
            <option value="robot-vacuum">로봇청소기</option>
          </select>
        </label>
        <label>
          <span>브랜드</span>
          <select
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
              모델 <span>{modelResultCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "parts"}
              aria-controls="part-results-panel"
              id="part-results-tab"
              onClick={() => setTabPreference("parts")}
            >
              소모품 <span>{partResultCount}</span>
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
                <section className="result-group" aria-labelledby="model-results-heading">
                  <div className="result-group-heading">
                    <div>
                      <span className="eyebrow">모델 결과</span>
                      <h2 id="model-results-heading">
                        {query ? "검색어와 일치하는 모델입니다" : "등록된 전체 모델"}
                      </h2>
                    </div>
                    <span>{modelMatches.primary.length}개</span>
                  </div>
                  <div className="model-grid">
                    {modelMatches.primary.map(({ model }) => (
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
                    <div>
                      <span className="eyebrow">소모품 결과</span>
                      <h2 id="part-results-heading">상품명과 부품번호가 일치합니다</h2>
                    </div>
                    <span>{consumableMatches.primary.length}개</span>
                  </div>
                  <div className="search-part-grid">
                    {consumableMatches.primary.map(({ part, reason }) => (
                      <PartResultCard part={part} reason={reason} key={part.id} />
                    ))}
                  </div>
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
                      {consumableMatches.related.map(({ part, reason }) => (
                        <PartResultCard
                          part={part}
                          reason={reason}
                          showCompatibleModels={false}
                          key={part.id}
                        />
                      ))}
                    </div>
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
              전체 모델 보기
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
