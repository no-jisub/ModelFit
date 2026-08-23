import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";

const rules = readFileSync(new URL("../firestore.rules", import.meta.url), "utf8");
const adminUid = "active-admin";
let testEnvironment: RulesTestEnvironment;

function validReport(overrides: Record<string, unknown> = {}) {
  const expiresAt = new Date();
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);

  return {
    schemaVersion: 1,
    category: "compatibility",
    productName: "LG AS355NSNA",
    pageUrl: "https://modelfit-kr.web.app/model/lg/as355nsna",
    description: "공식 설명서의 적용 모델 표기와 다릅니다.",
    evidenceUrl: "https://www.lge.co.kr/support/product-manuals",
    status: "received",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt),
    ...overrides,
  };
}

async function seedAdmin(uid = adminUid, active = true) {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await context.firestore().doc(`admins/${uid}`).set({ active });
  });
}

async function seedReport(id = "report-1") {
  const now = firebase.firestore.Timestamp.now();
  const expiresAt = new Date();
  expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);

  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await context
      .firestore()
      .doc(`reports/${id}`)
      .set({
        schemaVersion: 1,
        category: "compatibility",
        productName: "LG AS355NSNA",
        pageUrl: "https://modelfit-kr.web.app/model/lg/as355nsna",
        description: "검토할 제보",
        evidenceUrl: "",
        status: "received",
        createdAt: now,
        updatedAt: now,
        expiresAt: firebase.firestore.Timestamp.fromDate(expiresAt),
      });
  });
}

beforeAll(async () => {
  testEnvironment = await initializeTestEnvironment({
    projectId: "demo-modelfit-rules",
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

afterAll(async () => {
  await testEnvironment.cleanup();
});

describe("Firestore Security Rules Emulator", () => {
  it("공개 사용자는 엄격한 스키마의 제보만 생성할 수 있다", async () => {
    const reports = testEnvironment.unauthenticatedContext().firestore().collection("reports");

    await assertSucceeds(reports.add(validReport()));
    await assertFails(reports.add(validReport({ extraData: "schema pollution" })));
    await assertFails(reports.add(validReport({ status: "resolved" })));
    await assertFails(reports.add(validReport({ description: "x".repeat(2001) })));
    await assertFails(reports.add(validReport({ pageUrl: "http://example.com/report" })));
    await assertFails(
      reports.add(validReport({ createdAt: firebase.firestore.Timestamp.fromDate(new Date(0)) })),
    );
  });

  it("공개 사용자와 일반 사용자는 제보를 읽거나 변경할 수 없다", async () => {
    await seedReport();
    const publicReport = testEnvironment
      .unauthenticatedContext()
      .firestore()
      .doc("reports/report-1");
    const userReport = testEnvironment
      .authenticatedContext("regular-user")
      .firestore()
      .doc("reports/report-1");

    await assertFails(publicReport.get());
    await assertFails(publicReport.parent.limit(100).get());
    await assertFails(publicReport.update({ status: "reviewing" }));
    await assertFails(publicReport.delete());
    await assertFails(userReport.get());
    await assertFails(
      userReport.update({
        status: "reviewing",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        resolvedAt: null,
      }),
    );
  });

  it("활성 관리자는 제한된 쿼리로 제보를 읽을 수 있다", async () => {
    await seedAdmin();
    await seedReport();
    const adminDatabase = testEnvironment.authenticatedContext(adminUid).firestore();
    const reports = adminDatabase.collection("reports").orderBy("createdAt", "desc");

    await assertSucceeds(adminDatabase.doc("reports/report-1").get());
    await assertSucceeds(reports.limit(100).get());
    await assertFails(reports.get());
    await assertFails(reports.limit(101).get());
  });

  it("비활성 관리자와 다른 사용자는 관리자 권한을 얻을 수 없다", async () => {
    await seedAdmin("inactive-admin", false);
    await seedReport();
    const inactiveDatabase = testEnvironment.authenticatedContext("inactive-admin").firestore();
    const regularDatabase = testEnvironment.authenticatedContext("regular-user").firestore();

    await assertFails(inactiveDatabase.doc("reports/report-1").get());
    await assertFails(regularDatabase.doc(`admins/${adminUid}`).get());
    await assertFails(regularDatabase.doc("admins/regular-user").set({ active: true }));
  });

  it("활성 관리자도 상태 필드 외의 데이터와 ACL을 변경할 수 없다", async () => {
    await seedAdmin();
    await seedReport();
    const adminDatabase = testEnvironment.authenticatedContext(adminUid).firestore();
    const report = adminDatabase.doc("reports/report-1");

    await assertSucceeds(
      report.update({
        status: "reviewing",
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        resolvedAt: null,
      }),
    );
    await assertFails(report.update({ description: "관리자가 원문을 덮어씀" }));
    await assertFails(report.update({ extraData: "schema pollution" }));
    await assertFails(report.delete());
    await assertFails(adminDatabase.doc(`admins/${adminUid}`).update({ active: false }));
  });

  it("정의되지 않은 컬렉션은 기본 거부한다", async () => {
    const unknown = testEnvironment
      .authenticatedContext(adminUid)
      .firestore()
      .doc("unknown/document");

    await assertFails(unknown.get());
    await assertFails(unknown.set({ value: "blocked" }));
  });
});
