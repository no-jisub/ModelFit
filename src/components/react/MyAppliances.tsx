import { useEffect, useMemo, useState } from "react";
import { consumables } from "@/data/consumables";
import { models } from "@/data/models";
import {
  APPLIANCE_STORAGE_EVENT,
  type ReplacementReminder,
  type SavedAppliance,
  readSavedAppliances,
  writeSavedAppliances,
} from "@/utils/applianceStorage";
import { categoryLabels } from "@/utils/labels";
import { getModelDisplayName } from "@/utils/modelDisplayName";
import {
  formatKoreanDate,
  getDefaultIntervalDays,
  getLocalDateValue,
  getNextReplacementDate,
  getReminderState,
} from "@/utils/replacementReminder";

export default function MyAppliances() {
  const [savedAppliances, setSavedAppliances] = useState<SavedAppliance[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSavedAppliances(readSavedAppliances());
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
      savedAppliances
        .map((saved) => {
          const model = models.find((item) => item.id === saved.modelId);
          return model ? { model, saved } : undefined;
        })
        .filter((item) => item !== undefined),
    [savedAppliances],
  );

  const updateReminder = (modelId: string, partId: string, reminder: ReplacementReminder): void => {
    const next = savedAppliances.map((appliance) => {
      if (appliance.modelId !== modelId) return appliance;
      return {
        ...appliance,
        reminders: [...appliance.reminders.filter((item) => item.partId !== partId), reminder],
      };
    });
    writeSavedAppliances(next);
    setSavedAppliances(next);
  };

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
      {savedModels.map(({ model, saved }) => {
        const parts = model.consumableIds
          .map((id) => consumables.find((part) => part.id === id))
          .filter((part) => part !== undefined);
        const reminderItems = parts.map((part) => {
          const reminder = saved.reminders.find((item) => item.partId === part.id);
          return {
            part,
            reminder,
            defaultDays: getDefaultIntervalDays(part.type),
            state: getReminderState(reminder),
          };
        });
        const urgentReminderCount = reminderItems.filter(
          ({ state }) => state === "soon" || state === "overdue",
        ).length;

        return (
          <article className="cabinet-card card" key={model.id}>
            <div className="cabinet-card-heading">
              <span className="category-chip">{categoryLabels[model.category]}</span>
              <p className="model-brand-label">{model.brandName}</p>
              <h2>
                <a href={`/model/${model.brandId}/${model.slug}`}>{getModelDisplayName(model)}</a>
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
                    setSavedAppliances(next);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
            <details className="reminder-panel" open={urgentReminderCount > 0 ? true : undefined}>
              <summary className="reminder-panel-heading">
                <div>
                  <span className="eyebrow">사이트 내부 알림</span>
                  <h3 id={`reminder-${model.id}`}>교체 일정</h3>
                </div>
                <span>
                  {urgentReminderCount > 0
                    ? `${urgentReminderCount}개 확인 필요`
                    : `${parts.length}개 소모품 · 일정 보기`}
                </span>
              </summary>
              {parts.length > 0 ? (
                <div className="reminder-list">
                  {reminderItems.map(({ part, reminder, defaultDays, state }) => {
                    const stateLabel = {
                      unset: "알림 설정 필요",
                      ok: "교체 전",
                      soon: "곧 교체",
                      overdue: "교체일 지남",
                    }[state];

                    return (
                      <div className="reminder-item" key={part.id}>
                        <div className="reminder-copy">
                          <a href={`/model/${model.brandId}/${model.slug}#compatible-parts`}>
                            {part.displayName}
                          </a>
                          <span className={`reminder-status reminder-${state}`}>{stateLabel}</span>
                          <small>
                            {reminder
                              ? `다음 교체 예정 ${formatKoreanDate(getNextReplacementDate(reminder))}`
                              : `권장 기본값 ${defaultDays}일 · 사용 환경에 맞게 조정`}
                          </small>
                        </div>
                        <div className="reminder-item-actions">
                          <button
                            className="button button-secondary button-compact"
                            type="button"
                            onClick={() =>
                              updateReminder(model.id, part.id, {
                                partId: part.id,
                                lastReplacedAt: getLocalDateValue(),
                                intervalDays: reminder?.intervalDays ?? defaultDays,
                              })
                            }
                          >
                            오늘 교체 완료
                          </button>
                          <details className="reminder-settings">
                            <summary>상세 설정</summary>
                            <div className="reminder-controls">
                              <label>
                                <span>마지막 교체일</span>
                                <input
                                  type="date"
                                  value={reminder?.lastReplacedAt ?? ""}
                                  onChange={(event) => {
                                    if (!event.target.value) return;
                                    updateReminder(model.id, part.id, {
                                      partId: part.id,
                                      lastReplacedAt: event.target.value,
                                      intervalDays: reminder?.intervalDays ?? defaultDays,
                                    });
                                  }}
                                />
                              </label>
                              <label>
                                <span>교체 주기(일)</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="3650"
                                  value={reminder?.intervalDays ?? defaultDays}
                                  onChange={(event) => {
                                    const intervalDays = Number(event.target.value);
                                    if (!Number.isInteger(intervalDays) || intervalDays < 1) return;
                                    updateReminder(model.id, part.id, {
                                      partId: part.id,
                                      lastReplacedAt:
                                        reminder?.lastReplacedAt ?? getLocalDateValue(),
                                      intervalDays,
                                    });
                                  }}
                                />
                              </label>
                            </div>
                          </details>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="reminder-empty">알림을 설정할 교체형 소모품이 없습니다.</p>
              )}
            </details>
          </article>
        );
      })}
    </div>
  );
}
