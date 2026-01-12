import { TRAINING_TYPES, type TrainingTypeMeta } from "../domain/TrainingType";

export function normalizeTrainingType(type: string): TrainingTypeMeta["value"] {
    const t = String(type ?? "").trim().toLowerCase();

    return (TRAINING_TYPES.some((x) => x.value === t) ? t : "other") as TrainingTypeMeta["value"];
}

const FALLBACK_META: TrainingTypeMeta = TRAINING_TYPES.find((x) => x.value === "other")!;

export function getTrainingTypeMeta(type: string): TrainingTypeMeta {
    const norm = normalizeTrainingType(type);

    return TRAINING_TYPES.find((x) => x.value === norm) ?? FALLBACK_META;
}