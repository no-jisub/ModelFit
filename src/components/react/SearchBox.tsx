import { useEffect, useId, useMemo, useRef, useState } from "react";
import { consumables } from "@/data/consumables";
import { models } from "@/data/models";
import { categoryLabels, partTypeLabels, statusLabels } from "@/utils/labels";
import { getModelFullName } from "@/utils/modelDisplayName";
import { searchCatalog } from "@/utils/searchCatalog";

interface Props {
  initialQuery?: string;
  compact?: boolean;
  header?: boolean;
}

export default function SearchBox({ initialQuery = "", compact = false, header = false }: Props) {
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const results = searchCatalog(models, consumables, query, {
      modelLimit: 4,
      consumableLimit: 4,
      compatibleModelLimit: 0,
    });

    return [
      ...results.models.map(({ model, score }) => ({
        id: `model-${model.id}`,
        kind: "model" as const,
        title: getModelFullName(model),
        description: `${model.modelCode} · ${categoryLabels[model.category]}`,
        status: statusLabels[model.verificationStatus],
        url: `/model/${model.brandId}/${model.slug}#compatible-parts`,
        score,
      })),
      ...results.consumables.map(({ part, score, reason }) => ({
        id: `part-${part.id}`,
        kind: "part" as const,
        title: part.displayName,
        description: `${partTypeLabels[part.type]} · ${
          part.genuinePartNumber ?? "부품번호 미등록"
        }`,
        status: reason === "part-number" ? "부품번호 일치" : "소모품",
        url: `/part/${part.slug}`,
        score,
      })),
    ]
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ko"))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  function goToSearch(value = query) {
    const normalized = value.trim();
    window.location.assign(normalized ? `/find?q=${encodeURIComponent(normalized)}` : "/find");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) {
      if (event.key === "ArrowDown" && suggestions.length > 0) {
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) window.location.assign(selected.url);
    }
  }

  return (
    <div
      className={`search-widget ${compact ? "is-compact" : ""} ${header ? "is-header" : ""}`}
      ref={wrapperRef}
    >
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch();
        }}
      >
        <label className="sr-only" htmlFor={inputId}>
          모델명, 상품명 또는 정품 부품번호
        </label>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={header ? "모델·소모품 검색" : "예: 로보락 S8, ADQ30041405, 먼지봉투"}
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        <button className="button button-primary search-submit" type="submit">
          {header ? "검색" : "통합 검색"}
        </button>
      </form>
      {open && query.trim() && (
        <div className="autocomplete-panel" id={listId} role="listbox" aria-label="모델 검색 제안">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                type="button"
                role="option"
                id={`${listId}-${index}`}
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "is-active" : ""}
                key={suggestion.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => window.location.assign(suggestion.url)}
              >
                <span>
                  <strong>{suggestion.title}</strong>
                  <small>{suggestion.description}</small>
                </span>
                <span className={`autocomplete-status is-${suggestion.kind}`}>
                  {suggestion.kind === "model" ? "모델" : suggestion.status}
                </span>
              </button>
            ))
          ) : (
            <div className="autocomplete-empty">
              <strong>일치하는 모델이나 소모품이 없습니다.</strong>
              <span>모델번호, 상품명 또는 부품번호로 다시 검색해 보세요.</span>
            </div>
          )}
        </div>
      )}
      {!compact && !header && (
        <div className="popular-keywords" aria-label="인기 검색어">
          <span>인기 검색</span>
          {["로보락 S8", "ADQ30041405", "먼지봉투"].map((item) => (
            <button type="button" key={item} onClick={() => goToSearch(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
