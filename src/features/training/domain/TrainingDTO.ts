export type ActivityDTO = {
    id: number;
    user_id: number;
    name: string | null;
    type: string | null;
    note: string | null;
    photo_path: string | null;
    distance: number | string | null;
    time: number | null;
    created_at: string;
    updated_at: string;
};

export type TrainingInput = {
    name: string;
    type: string;
    note?: string | null;
    photo_path?: string | null;
    distanceM?: number;
    durationMin?: number;
};
