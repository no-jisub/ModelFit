import { useEffect, useMemo, useState, type SyntheticEvent } from "react";
import { isAppCheckConfigured, isFirebaseConfigured } from "@/lib/firebase/client";
import { submitReport } from "@/lib/reports/repository";
import {
  REPORT_LIMITS,
  normalizeReportInput,
  validateReportInput,
  type ReportCategory,
} from "@/lib/reports/schema";
import { analytics } from "@/utils/analytics";

interface Props {
  defaultProductName?: string;
  defaultPageUrl?: string;
}

const categoryOptions: Array<{ value: ReportCategory; label: string }> = [
  { value: "model", label: "모델 정보" },
  { value: "consumable", label: "소모품 정보" },
  { value: "compatibility", label: "호환 정보" },
  { value: "other", label: "기타" },
];

export default function ReportForm({ defaultProductName = "", defaultPageUrl = "" }: Props) {
  const ready = useMemo(() => isFirebaseConfigured() && isAppCheckConfigured(), []);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(
    ready
      ? "필수 항목을 입력한 뒤 제보를 보내주세요."
      : "안전한 제보 저장소를 준비 중입니다. 설정이 완료되면 이 화면에서 바로 접수할 수 있습니다.",
  );
  const [messageType, setMessageType] = useState<"idle" | "success" | "error">("idle");
  const [formKey, setFormKey] = useState(0);
  const [productName, setProductName] = useState(defaultProductName);
  const [pageUrl, setPageUrl] = useState(defaultPageUrl);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryProductName = [params.get("brand"), params.get("model")]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ");
    const queryPage = params.get("page")?.trim();

    if (queryProductName) setProductName(queryProductName);
    if (queryPage) setPageUrl(new URL(queryPage, window.location.origin).toString());
  }, []);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!ready || pending) return;

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);

    // 화면에 보이지 않는 항목입니다. 자동 입력 봇만 값을 넣는 경우 저장하지 않습니다.
    if (values.get("website")) {
      setMessage("제보를 접수했습니다.");
      setMessageType("success");
      return;
    }

    const input = normalizeReportInput({
      category: values.get("category") as ReportCategory,
      productName: String(values.get("productName") ?? ""),
      pageUrl: String(values.get("pageUrl") ?? ""),
      description: String(values.get("description") ?? ""),
      evidenceUrl: String(values.get("evidenceUrl") ?? ""),
    });
    const errors = validateReportInput(input);
    if (errors.length > 0) {
      setMessage(errors[0]);
      setMessageType("error");
      return;
    }

    setPending(true);
    setMessage("제보를 안전하게 저장하고 있습니다…");
    setMessageType("idle");

    try {
      await submitReport(input);
      analytics.trackReportSubmit("site");
      setMessage("제보가 접수되었습니다. 확인 후 정보에 반영하겠습니다.");
      setMessageType("success");
      setFormKey((value) => value + 1);
    } catch {
      setMessage("현재 제보를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.");
      setMessageType("error");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="form-card card report-form" key={formKey} onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="category">오류 유형</label>
          <select id="category" name="category" defaultValue="compatibility" required>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="productName">제품명 또는 모델명</label>
          <input
            id="productName"
            name="productName"
            value={productName}
            onChange={(event) => setProductName(event.currentTarget.value)}
            maxLength={REPORT_LIMITS.productName}
            autoComplete="off"
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="pageUrl">오류가 있는 모델핏 페이지</label>
          <input
            id="pageUrl"
            name="pageUrl"
            type="url"
            value={pageUrl}
            onChange={(event) => setPageUrl(event.currentTarget.value)}
            maxLength={REPORT_LIMITS.pageUrl}
            placeholder="https://modelfit-kr.web.app/model/..."
            required
          />
          <small>주소창의 URL을 그대로 붙여 넣어주세요.</small>
        </div>
        <div className="field field-full">
          <label htmlFor="description">어떤 정보가 잘못되었나요?</label>
          <textarea
            id="description"
            name="description"
            maxLength={REPORT_LIMITS.description}
            placeholder="현재 표시된 내용과 올바른 내용을 함께 적어주세요."
            required
          />
        </div>
        <div className="field field-full">
          <label htmlFor="evidenceUrl">
            참고 URL <span className="field-optional">(선택)</span>
          </label>
          <input
            id="evidenceUrl"
            name="evidenceUrl"
            type="url"
            maxLength={REPORT_LIMITS.evidenceUrl}
            placeholder="https://제조사-공식-자료..."
          />
          <small>제조사 제품 페이지나 설명서 링크가 있으면 더 빠르게 확인할 수 있습니다.</small>
        </div>
        <div className="report-honeypot" aria-hidden="true">
          <label htmlFor="website">웹사이트</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </div>
      <div className="form-actions">
        <p className={`form-message is-${messageType}`} role="status" aria-live="polite">
          {message}
        </p>
        <button className="button button-primary" type="submit" disabled={!ready || pending}>
          {pending ? "접수 중…" : "오류 제보 보내기"}
        </button>
      </div>
    </form>
  );
}
