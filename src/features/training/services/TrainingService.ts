import { api } from "../../../shared/services/http/api";
import type { ActivityDTO, TrainingInput } from "../domain/TrainingDTO";
import { TrainingFactory } from "../domain/TrainingFactory";
import type {TrainingStatsDTO} from "../domain/TrainingStatsDTO.ts";

export class TrainingService {
    static async list(): Promise<ActivityDTO[]> {
        const { data } = await api.get<ActivityDTO[]>("/activities");
        return data;
    }

    static async get(id: number): Promise<ActivityDTO> {
        const { data } = await api.get<ActivityDTO>(`/activities/${id}`);
        return data;
    }

    static async create(payload: TrainingInput): Promise<ActivityDTO> {
        const body = TrainingFactory.toApiInput({
            name: payload.name,
            type: payload.type,
            distanceM: payload.distanceM,
            durationMin: payload.durationMin,
            note: payload.note ?? null,
            photo_path: payload.photo_path ?? null,
        });

        const { data } = await api.post<ActivityDTO>("/activities/add", body);
        return data;
    }

    static async update(id: number, payload: TrainingInput): Promise<ActivityDTO> {
        const body = TrainingFactory.toApiInput({
            name: payload.name,
            type: payload.type,
            distanceM: payload.distanceM,
            durationMin: payload.durationMin,
            note: payload.note ?? null,
            photo_path: payload.photo_path ?? null,
        });

        const { data } = await api.put<ActivityDTO>(`/activities/${id}`, body);
        return data;
    }

    static async remove(id: number): Promise<void> {
        await api.delete(`/activities/${id}`);
    }
    static async stats(): Promise<TrainingStatsDTO> {
        const { data } = await api.get<TrainingStatsDTO>("/activities/stats");
        return data;
    }
}
