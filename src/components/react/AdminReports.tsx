import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { observeAdminSession, signInAdminWithGoogle, signOutAdmin } from "@/lib/firebase/adminAuth";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { hasAdminAccess, listReports, updateReportStatus } from "@/lib/reports/repository";
import { REPORT_STATUSES, type ReportStatus, type StoredReport } from "@/lib/reports/schema";

const statusLabels: Record<ReportStatus, string> = {
  received: "접수",
  reviewing: "검토 중",
  resolved: "수정 완료",
  rejected: "반려",
};

const categoryLabels = {
  model: "모델",
  consumable: "소모품",
  compatibility: "호환",
  other: "기타",
};

type ScreenState = "checking" | "signed-out" | "denied" | "ready" | "error";

function formatDate(value: Date | null) {
  return value
    ? new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(value)
    : "처리 중";
}

export default function AdminReports() {
  const configured = useMemo(() => isFirebaseConfigured(), []);
  const [screen, setScreen] = useState<ScreenState>(configured ? "checking" : "error");
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const [message, setMessage] = useState(
    configured ? "관리자 세션을 확인하고 있습니다…" : "Firebase 관리자 인증 설정이 필요합니다.",
  );
  const [pendingId, setPendingId] = useState<string>();

  useEffect(() => {
    if (!configured) return;
    let unsubscribe: (() => void) | undefined;
    let active = true;

    observeAdminSession(async (currentUser) => {
      if (!active) return;
      setUser(currentUser);
      if (!currentUser) {
        setScreen("signed-out");
        setReports([]);
        setMessage("등록된 관리자 Google 계정으로 로그인해 주세요.");
        return;
      }

      setScreen("checking");
      setMessage("관리자 권한을 확인하고 있습니다…");
      try {
        if (!(await hasAdminAccess(currentUser.uid))) {
          setScreen("denied");
          setMessage("이 계정에는 관리자 권한이 없습니다.");
          return;
        }
        const items = await listReports();
        if (!active) return;
        setReports(items);
        setScreen("ready");
        setMessage(`최근 제보 ${items.length}건을 불러왔습니다.`);
      } catch {
        if (!active) return;
        setScreen("error");
        setMessage("관리자 데이터에 연결하지 못했습니다. Firebase 설정을 확인해 주세요.");
      }
    })
      .then((stop) => {
        if (active) unsubscribe = stop;
        else stop();
      })
      .catch(() => {
        if (!active) return;
        setScreen("error");
        setMessage("관리자 인증을 시작하지 못했습니다.");
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [configured]);

  const visibleReports = reports.filter((report) => filter === "all" || report.status === filter);

  async function login() {
    setScreen("checking");
    setMessage("Google 로그인을 여는 중입니다…");
    try {
      await signInAdminWithGoogle();
    } catch {
      setScreen("signed-out");
      setMessage("로그인을 완료하지 못했습니다. 다시 시도해 주세요.");
    }
  }

  async function logout() {
    await signOutAdmin();
  }

  async function changeStatus(reportId: string, status: ReportStatus) {
    setPendingId(reportId);
    try {
      await updateReportStatus(reportId, status);
      setReports((items) =>
        items.map((item) =>
          item.id === reportId ? { ...item, status, updatedAt: new Date() } : item,
        ),
      );
      setMessage("처리 상태를 저장했습니다.");
    } catch {
      setMessage("상태를 저장하지 못했습니다. 권한과 네트워크를 확인해 주세요.");
    } finally {
      setPendingId(undefined);
    }
  }

  if (!configured) {
    return (
      <div className="admin-state card">
        <span className="admin-state-icon" aria-hidden="true">
          ⚙
        </span>
        <h2>관리자 인증 설정을 준비 중입니다</h2>
        <p>{message}</p>
      </div>
    );
  }

  if (screen === "checking") {
    return (
      <div className="admin-state card" aria-live="polite">
        <span className="admin-state-icon" aria-hidden="true">
          ◷
        </span>
        <h2>접근 권한 확인 중</h2>
        <p>{message}</p>
      </div>
    );
  }

  if (screen === "signed-out") {
    return (
      <div className="admin-state card">
        <span className="admin-state-icon" aria-hidden="true">
          🔒
        </span>
        <h2>관리자 로그인</h2>
        <p>{message}</p>
        <button className="button button-primary" type="button" onClick={login}>
          Google 계정으로 로그인
        </button>
        <small>로그인은 현재 브라우저 세션에만 유지됩니다.</small>
      </div>
    );
  }

  if (screen === "denied") {
    return (
      <div className="admin-state card">
        <span className="admin-state-icon" aria-hidden="true">
          !
        </span>
        <h2>관리자 등록이 필요합니다</h2>
        <p>{message}</p>
        <div className="admin-identity">
          <span>로그인 계정</span>
          <strong>{user?.email ?? "이메일 확인 불가"}</strong>
          <span>Firebase UID</span>
          <code>{user?.uid}</code>
        </div>
        <p className="admin-help">
          Firebase Console에서 이 UID를 <code>admins</code> 컬렉션의 문서 ID로 등록하고
          <code>active</code> 값을 <code>true</code>로 설정해야 합니다.
        </p>
        <button className="button button-secondary" type="button" onClick={logout}>
          다른 계정으로 로그인
        </button>
      </div>
    );
  }

  if (screen === "error") {
    return (
      <div className="admin-state card">
        <span className="admin-state-icon" aria-hidden="true">
          !
        </span>
        <h2>관리자 화면을 열지 못했습니다</h2>
        <p>{message}</p>
        {user && (
          <button className="button button-secondary" type="button" onClick={logout}>
            로그아웃
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-toolbar card">
        <div>
          <strong>{user?.email}</strong>
          <p role="status" aria-live="polite">
            {message}
          </p>
        </div>
        <div className="admin-toolbar-actions">
          <label htmlFor="report-filter">상태</label>
          <select
            id="report-filter"
            value={filter}
            onChange={(event) => setFilter(event.currentTarget.value as ReportStatus | "all")}
          >
            <option value="all">전체</option>
            {REPORT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
          <button className="button button-secondary button-compact" type="button" onClick={logout}>
            로그아웃
          </button>
        </div>
      </div>

      {visibleReports.length === 0 ? (
        <div className="admin-state card">
          <span className="admin-state-icon" aria-hidden="true">
            ✓
          </span>
          <h2>표시할 제보가 없습니다</h2>
          <p>선택한 상태에 해당하는 제보가 접수되면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="admin-report-list">
          {visibleReports.map((report) => (
            <article className="admin-report-card card" key={report.id}>
              <div className="admin-report-heading">
                <div>
                  <span className={`report-status is-${report.status}`}>
                    {statusLabels[report.status]}
                  </span>
                  <span className="category-chip">{categoryLabels[report.category]}</span>
                  <h2>{report.productName}</h2>
                </div>
                <time>{formatDate(report.createdAt)}</time>
              </div>
              <p className="admin-report-description">{report.description}</p>
              <div className="admin-report-links">
                <a href={report.pageUrl} target="_blank" rel="noopener noreferrer">
                  오류 페이지 열기 ↗
                </a>
                {report.evidenceUrl && (
                  <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer">
                    참고 자료 열기 ↗
                  </a>
                )}
              </div>
              <div className="admin-report-footer">
                <span>보관 만료 {formatDate(report.expiresAt)}</span>
                <label>
                  처리 상태
                  <select
                    value={report.status}
                    disabled={pendingId === report.id}
                    onChange={(event) =>
                      changeStatus(report.id, event.currentTarget.value as ReportStatus)
                    }
                  >
                    {REPORT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
