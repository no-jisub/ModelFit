import { useEffect, useId, useMemo, useRef, useState } from "react";
import { models } from "@/data/models";
import { categoryLabels, statusLabels } from "@/utils/labels";
import { searchModels } from "@/utils/searchModels";

interface Props {
  initialQuery?: string;
  compact?: boolean;
}

export default function SearchBox({ initialQuery = "", compact = false }: Props) {
  const inputId = useId();
  const listId = useId();
  const [query, setQuery] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const results = useMemo(
    () => (query.trim().length > 0 ? searchModels(models, query, { limit: 5 }) : []),
    [query],
  );

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
    if (!open || results.length === 0) {
      if (event.key === "ArrowDown" && results.length > 0) {
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      const selected = results[activeIndex]?.model;
      if (selected) window.location.assign(`/model/${selected.brandId}/${selected.slug}`);
    }
  }

  return (
    <div className={`search-widget ${compact ? "is-compact" : ""}`} ref={wrapperRef}>
      <form
        className="search-form"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch();
        }}
      >
        <label className="sr-only" htmlFor={inputId}>
          브랜드 또는 가전제품 모델명
        </label>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder="예: 로보락 S8, AX60R5080WD"
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
          모델 찾기
        </button>
      </form>
      {open && query.trim() && (
        <div className="autocomplete-panel" id={listId} role="listbox" aria-label="모델 검색 제안">
          {results.length > 0 ? (
            results.map(({ model }, index) => (
              <button
                type="button"
                role="option"
                id={`${listId}-${index}`}
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "is-active" : ""}
                key={model.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => window.location.assign(`/model/${model.brandId}/${model.slug}`)}
              >
                <span>
                  <strong>
                    {model.brandName} {model.modelName}
                  </strong>
                  <small>
                    {model.modelCode} · {categoryLabels[model.category]}
                  </small>
                </span>
                <span className="autocomplete-status">
                  ! {statusLabels[model.verificationStatus]}
                </span>
              </button>
            ))
          ) : (
            <div className="autocomplete-empty">
              <strong>일치하는 모델이 없습니다.</strong>
              <span>공백과 하이픈을 제외해 다시 검색해 보세요.</span>
            </div>
          )}
        </div>
      )}
      {!compact && (
        <div className="popular-keywords" aria-label="인기 검색어">
          <span>인기 검색</span>
          {["로보락 S8", "AX60R5080WD", "LG AS120"].map((item) => (
            <button type="button" key={item} onClick={() => goToSearch(item)}>
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
