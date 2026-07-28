export const APPLIANCE_STORAGE_KEY = "modelfit:appliances:v1";
export const APPLIANCE_STORAGE_EVENT = "modelfit:appliances-changed";

export interface SavedAppliance {
  modelId: string;
  savedAt: string;
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function isSavedAppliance(value: unknown): value is SavedAppliance {
  if (!value || typeof value !== "object") return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.modelId === "string" &&
    item.modelId.trim().length > 0 &&
    typeof item.savedAt === "string" &&
    !Number.isNaN(Date.parse(item.savedAt))
  );
}

export function parseSavedAppliances(value: string | null): SavedAppliance[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    return parsed.filter((item): item is SavedAppliance => {
      if (!isSavedAppliance(item) || seen.has(item.modelId)) return false;
      seen.add(item.modelId);
      return true;
    });
  } catch {
    return [];
  }
}

function getBrowserStorage(): StorageLike | undefined {
  if (typeof window === "undefined") return undefined;
  return window.localStorage;
}

export function readSavedAppliances(storage = getBrowserStorage()): SavedAppliance[] {
  return storage ? parseSavedAppliances(storage.getItem(APPLIANCE_STORAGE_KEY)) : [];
}

export function writeSavedAppliances(
  appliances: SavedAppliance[],
  storage = getBrowserStorage(),
): void {
  if (!storage) return;
  storage.setItem(APPLIANCE_STORAGE_KEY, JSON.stringify(appliances));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(APPLIANCE_STORAGE_EVENT));
  }
}

export function toggleSavedAppliance(
  modelId: string,
  storage = getBrowserStorage(),
  now = new Date(),
): SavedAppliance[] {
  const appliances = readSavedAppliances(storage);
  const exists = appliances.some((item) => item.modelId === modelId);
  const next = exists
    ? appliances.filter((item) => item.modelId !== modelId)
    : [...appliances, { modelId, savedAt: now.toISOString() }];

  writeSavedAppliances(next, storage);
  return next;
}
