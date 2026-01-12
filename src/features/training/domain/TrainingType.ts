import type { MessageKey } from "../../../shared/i18n/messages";

export type TrainingType =
    | "running"
    | "walking"
    | "cycling"
    | "skating"
    | "skateboarding"
    | "other";

export type TrainingTypeMeta = {
    value: TrainingType;
    i18nKey: MessageKey;
    emoji: string;
};

export const TRAINING_TYPES = [
    { value: "running", i18nKey: "training.type.running", emoji: "🏃" },
    { value: "walking", i18nKey: "training.type.walking", emoji: "🚶" },
    { value: "cycling", i18nKey: "training.type.cycling", emoji: "🚴" },
    { value: "skating", i18nKey: "training.type.skating", emoji: "🛼" },
    { value: "skateboarding", i18nKey: "training.type.skateboarding", emoji: "🛹" },
    { value: "other", i18nKey: "training.type.other", emoji: "✨" },
] as const satisfies readonly TrainingTypeMeta[];

const FALLBACK_META: TrainingTypeMeta =
    TRAINING_TYPES.find((x) => x.value === "other") ?? TRAINING_TYPES[0];

export function normalizeTrainingType(v: unknown): TrainingType {
    const s = String(v ?? "").trim().toLowerCase();
    const ok = TRAINING_TYPES.some((x) => x.value === s);
    return (ok ? s : "other") as TrainingType;
}

export function getTrainingTypeMeta(type: unknown): TrainingTypeMeta {
    const norm = normalizeTrainingType(type);
    return TRAINING_TYPES.find((x) => x.value === norm) ?? FALLBACK_META;
}

/**
 * API -> UI (backend typy)
 * run / walk / cycle / bike ...
 */
export function apiTypeToUiType(apiType: unknown): TrainingType {
    const t = String(apiType ?? "").trim().toLowerCase();

    if (t === "run" || t === "running") return "running";
    if (t === "walk" || t === "walking") return "walking";
    if (t === "cycle" || t === "cycling" || t === "bike" || t === "bicycle") return "cycling";
    if (t === "skating" || t === "roller" || t === "rollers") return "skating";
    if (t === "skateboarding" || t === "skateboard") return "skateboarding";

    return "other";
}

/**
 * UI -> API (co zapisujemy do bazy)
 */
export function uiTypeToApiType(uiType: unknown): string {
    const t = normalizeTrainingType(uiType);

    if (t === "running") return "run";
    if (t === "walking") return "walk";
    if (t === "cycling") return "cycle";
    if (t === "skating") return "skating";
    if (t === "skateboarding") return "skateboarding";
    return "other";
}
