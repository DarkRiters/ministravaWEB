import { api } from "../../../shared/services/http/api";

export type AdminUserLite = {
    id: number;
    email: string;
    first_name?: string | null;
    last_name?: string | null;
};

export type AdminActivity = {
    id: number;
    user_id: number;
    name: string;
    type: string;
    note?: string | null;
    distance?: number | null;
    time?: number | null;
    created_at: string;
    user?: AdminUserLite;
};

type Collection<T> = { data: T[] };

export class AdminActivityService {
    static async listAll(): Promise<Collection<AdminActivity> | AdminActivity[]> {
        const res = await api.get("/admin/activities");
        return res.data;
    }

    static async delete(id: number): Promise<{ message?: string }> {
        const res = await api.delete(`/admin/activities/${id}`);
        return res.data;
    }
}
