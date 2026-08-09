import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/client";
import {
  normalizeReportInput,
  reportExpiresAt,
  validateReportInput,
  type ReportInput,
  type ReportStatus,
  type StoredReport,
} from "./schema";

const REPORTS_COLLECTION = "reports";

function database() {
  return getFirestore(getFirebaseApp());
}

export async function submitReport(input: ReportInput) {
  const normalized = normalizeReportInput(input);
  const errors = validateReportInput(normalized);
  if (errors.length > 0) throw new Error(errors[0]);

  return addDoc(collection(database(), REPORTS_COLLECTION), {
    schemaVersion: 1,
    ...normalized,
    evidenceUrl: normalized.evidenceUrl ?? "",
    status: "received",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    expiresAt: Timestamp.fromDate(reportExpiresAt()),
  });
}

function toDate(value: unknown) {
  return value instanceof Timestamp ? value.toDate() : null;
}

export async function listReports(): Promise<StoredReport[]> {
  const snapshot = await getDocs(
    query(collection(database(), REPORTS_COLLECTION), orderBy("createdAt", "desc"), limit(100)),
  );

  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      category: data.category,
      productName: data.productName,
      pageUrl: data.pageUrl,
      description: data.description,
      evidenceUrl: data.evidenceUrl || undefined,
      status: data.status,
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      expiresAt: toDate(data.expiresAt),
    } as StoredReport;
  });
}

export async function hasAdminAccess(uid: string) {
  const snapshot = await getDoc(doc(database(), "admins", uid));
  return snapshot.exists() && snapshot.data().active === true;
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  await updateDoc(doc(database(), REPORTS_COLLECTION, reportId), {
    status,
    updatedAt: serverTimestamp(),
    resolvedAt: status === "resolved" || status === "rejected" ? serverTimestamp() : null,
  });
}
