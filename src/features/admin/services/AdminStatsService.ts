import { api } from "../../../shared/services/http/api";

export type AdminStatsDTO = {
    users_count: number;
    activities_count: number;
    total_distance: number;
    total_time: number;
};

export class AdminStatsService {
    static async get(): Promise<AdminStatsDTO> {
        const res = await api.get("/admin/stats", {
            headers: { Accept: "application/json" },
        });
        return res.data as AdminStatsDTO;
    }
}
