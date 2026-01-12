export type TrainingStatsTypeDTO = {
    activities: number;
    distance: number | string | null;
    time_seconds: number | string | null;
    time_human: string | null;
};

export type TrainingStatsOverallDTO = {
    activities: number;
    distance: number | string | null;
    time_seconds: number | string | null;
    time_human: string | null;
    types: Record<string, TrainingStatsTypeDTO>;
};

export type TrainingStatsMonthlyDTO = {
    month: string;
    activities: number;
    distance: number | string | null;
    time_seconds: number | string | null;
    time_human: string | null;
    types: Record<string, TrainingStatsTypeDTO>;
};

export type TrainingStatsDTO = {
    overall: TrainingStatsOverallDTO;
    monthly: TrainingStatsMonthlyDTO[];
};
