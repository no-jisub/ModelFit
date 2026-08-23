import { useEffect, useId, useMemo, useRef, useState } from "react";
import { analytics } from "@/utils/analytics";
import { searchAutocomplete, type AutocompleteIndex } from "@/utils/autocomplete";

let autocompleteIndexPromise: Promise<AutocompleteIndex> | undefined;

function loadAutocompleteIndex() {
  autocompleteIndexPromise ??= fetch("/search-index.json", {
    headers: { Accept: "application/json" },
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`검색 인덱스 요청 실패: ${response.status}`);
      const index = (await response.json()) as Partial<AutocompleteIndex>;
      if (
        index.version !== 1 ||
        !Array.isArray(index.models) ||
        !Array.isArray(index.consumables)
      ) {
        throw new Error("검색 인덱스 형식이 올바르지 않습니다.");
      }
      return index as AutocompleteIndex;
    })
    .catch((error) => {
      autocompleteIndexPromise = undefined;
      throw error;
    });

  return autocompleteIndexPromise;
}

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
  const [autocompleteIndex, setAutocompleteIndex] = useState<AutocompleteIndex | null>(null);
  const [indexState, setIndexState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const requestVersion = useRef(0);
  const suggestions = useMemo(
    () => (autocompleteIndex ? searchAutocomplete(autocompleteIndex, query) : []),
    [autocompleteIndex, query],
  );

  function ensureAutocompleteIndex() {
    if (autocompleteIndex || indexState === "loading") return;
    const version = ++requestVersion.current;
    setIndexState("loading");
    void loadAutocompleteIndex()
      .then((index) => {
        if (requestVersion.current !== version) return;
        setAutocompleteIndex(index);
        setIndexState("ready");
      })
      .catch(() => {
        if (requestVersion.current === version) setIndexState("error");
      });
  }

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

  useEffect(
    () => () => {
      requestVersion.current += 1;
    },
    [],
  );

  function goToSearch(value = query) {
    const normalized = value.trim();
    analytics.trackSearchSubmit(
      normalized,
      value === query ? (header ? "header" : "page") : "popular",
    );
    window.location.assign(normalized ? `/find?q=${encodeURIComponent(normalized)}` : "/find");
  }

  function selectSuggestion(index: number) {
    const selected = suggestions[index];
    if (!selected) return;
    analytics.trackAutocompleteSelect(query.trim(), selected.kind, selected.entityId, index + 1);
    window.location.assign(selected.url);
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
      selectSuggestion(activeIndex);
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
        action="/find"
        method="get"
        onSubmit={(event) => {
          event.preventDefault();
          goToSearch();
        }}
      >
        <label className="sr-only" htmlFor={inputId}>
          {header ? "모델번호·부품번호 검색" : "모델명, 상품명 또는 정품 부품번호"}
        </label>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={inputId}
          name="q"
          type="search"
          value={query}
          placeholder={header ? "모델번호·부품번호 검색" : "예: 로보락 S8 또는 ADQ30041405"}
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
            if (event.target.value.trim()) ensureAutocompleteIndex();
          }}
          onFocus={() => {
            setOpen(true);
            ensureAutocompleteIndex();
          }}
          onKeyDown={onKeyDown}
        />
        <button className="button button-primary search-submit" type="submit">
          소모품 찾기
        </button>
      </form>
      {open && query.trim() && (
        <div className="autocomplete-panel" id={listId} role="listbox" aria-label="모델 검색 제안">
          {indexState === "loading" || indexState === "idle" ? (
            <div className="autocomplete-empty">
              <strong>검색 데이터를 불러오는 중입니다.</strong>
            </div>
          ) : indexState === "error" ? (
            <div className="autocomplete-empty">
              <strong>자동완성을 불러오지 못했습니다.</strong>
              <span>검색 버튼을 누르면 전체 결과를 확인할 수 있습니다.</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                type="button"
                role="option"
                id={`${listId}-${index}`}
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "is-active" : ""}
                key={suggestion.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectSuggestion(index)}
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
