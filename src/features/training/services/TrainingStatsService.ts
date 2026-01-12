import { api } from "../../../shared/services/http/api";

export type StatsTypeRowDTO = {
    activities: number;
    distance: number | string | null;
    time_seconds: number;
    time_human: string;
};

export type MonthlyStatsDTO = {
    month: string;
    activities: number;
    distance: number | string | null;
    time_seconds: number;
    time_human: string;
    types: Record<string, StatsTypeRowDTO>;
};

export type TrainingStatsDTO = {
    overall: {
        activities: number;
        distance: number | string | null;    
        time_seconds: number;
        time_human: string;
        types: Record<string, StatsTypeRowDTO>;
    };
    monthly: MonthlyStatsDTO[];
};

export class TrainingStatsService {
    static async get(): Promise<TrainingStatsDTO> {
        const { data } = await api.get<TrainingStatsDTO>("/activities/stats");
        return data;
    }
}
