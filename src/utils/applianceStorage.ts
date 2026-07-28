export const APPLIANCE_STORAGE_KEY = "modelfit:appliances:v1";
export const APPLIANCE_STORAGE_EVENT = "modelfit:appliances-changed";

export interface ReplacementReminder {
  partId: string;
  lastReplacedAt: string;
  intervalDays: number;
}

export interface SavedAppliance {
  modelId: string;
  savedAt: string;
  reminders: ReplacementReminder[];
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function parseReminder(value: unknown): ReplacementReminder | undefined {
  if (!value || typeof value !== "object") return undefined;

  const item = value as Record<string, unknown>;
  if (
    typeof item.partId !== "string" ||
    item.partId.trim().length === 0 ||
    typeof item.lastReplacedAt !== "string" ||
    Number.isNaN(Date.parse(`${item.lastReplacedAt}T00:00:00`)) ||
    typeof item.intervalDays !== "number" ||
    !Number.isInteger(item.intervalDays) ||
    item.intervalDays < 1 ||
    item.intervalDays > 3650
  ) {
    return undefined;
  }

  return {
    partId: item.partId,
    lastReplacedAt: item.lastReplacedAt,
    intervalDays: item.intervalDays,
  };
}

function parseSavedAppliance(value: unknown): SavedAppliance | undefined {
  if (!value || typeof value !== "object") return undefined;

  const item = value as Record<string, unknown>;
  if (
    typeof item.modelId !== "string" ||
    item.modelId.trim().length === 0 ||
    typeof item.savedAt !== "string" ||
    Number.isNaN(Date.parse(item.savedAt))
  ) {
    return undefined;
  }

  const reminderIds = new Set<string>();
  const reminders = Array.isArray(item.reminders)
    ? item.reminders.map(parseReminder).filter((reminder): reminder is ReplacementReminder => {
        if (!reminder || reminderIds.has(reminder.partId)) return false;
        reminderIds.add(reminder.partId);
        return true;
      })
    : [];

  return { modelId: item.modelId, savedAt: item.savedAt, reminders };
}

export function parseSavedAppliances(value: string | null): SavedAppliance[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set<string>();
    return parsed.map(parseSavedAppliance).filter((item): item is SavedAppliance => {
      if (!item || seen.has(item.modelId)) return false;
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
    : [...appliances, { modelId, savedAt: now.toISOString(), reminders: [] }];

  writeSavedAppliances(next, storage);
  return next;
}
