import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");

describe("Firestore 보안 규칙 회귀 방지", () => {
  it("공개 사용자는 검증된 제보 생성만 가능하다", () => {
    expect(rules).toContain("allow create: if isValidReportCreate()");
    expect(rules).toContain("data.keys().hasOnly");
    expect(rules).toContain("data.description.size() <= 2000");
    expect(rules).toContain("data.status == 'received'");
    expect(rules).toContain("data.createdAt == request.time");
  });

  it("관리자 권한은 서버의 UID 문서에서만 가져온다", () => {
    expect(rules).toContain("documents/admins/$(request.auth.uid)");
    expect(rules).toContain(".data.active == true");
    expect(rules).not.toMatch(/request\.resource\.data\.(isAdmin|role)/);
  });

  it("관리자도 상태 외 필드와 삭제 권한을 갖지 않는다", () => {
    expect(rules).toContain("affectedKeys().hasOnly(['status', 'updatedAt', 'resolvedAt'])");
    expect(rules).toContain("allow delete: if false");
    expect(rules).toContain("request.query.limit <= 100");
    expect(rules).toContain("allow list, create, update, delete: if false");
  });
});
