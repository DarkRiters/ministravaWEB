import type { ActivityDTO } from "./TrainingDTO";
import type { Training, TrainingStatus } from "./Training";
import { apiTypeToUiType, uiTypeToApiType } from "./TrainingType";

function normalizeStatus(): TrainingStatus {
    return "finished";
}

function toNumber(v: unknown): number {
    const n = typeof v === "string" ? Number(v) : (v as number);
    return Number.isFinite(n) ? n : 0;
}

export class TrainingFactory {
    static fromDTO(dto: ActivityDTO): Training {
        const km = toNumber(dto.distance);
        const min = toNumber(dto.time);

        return {
            id: dto.id,
            name: dto.name ?? "(no name)",
            type: apiTypeToUiType(dto.type),
            durationMin: Math.max(0, Math.floor(min)),
            distanceM: Math.max(0, Math.round(km * 1000)),
            note: dto.note ?? null,
            photo_path: dto.photo_path ?? null,
            status: normalizeStatus(),
        };
    }

    static toApiInput(model: {
        name: string;
        type: unknown;
        distanceM?: number;
        durationMin?: number;
        note?: string | null;
        photo_path?: string | null;
    }): Record<string, any> {
        const km = Math.max(0, (model.distanceM ?? 0) / 1000);

        return {
            name: model.name,
            type: uiTypeToApiType(model.type),
            note: model.note ?? null,
            photo_path: model.photo_path ?? null,
            distance: km,
            time: Math.max(0, Math.floor(model.durationMin ?? 0)),
        };
    }
}
