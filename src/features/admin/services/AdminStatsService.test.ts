import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "../../../shared/services/http/api";
import {AdminStatsService} from "./AdminStatsService.ts";

vi.mock("../../../shared/services/http/api", () => ({
    api: {
        get: vi.fn(),
    },
}));

describe("AdminStatsService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should fetch admin stats and return AdminStatsDTO", async () => {
        const mockStats = {
            users_count: 10,
            activities_count: 55,
            total_distance: 1234.5,
            total_time: 98765,
        };

        (api.get as any).mockResolvedValueOnce({
            data: mockStats,
        });

        const result = await AdminStatsService.get();

        expect(api.get).toHaveBeenCalledOnce();
        expect(api.get).toHaveBeenCalledWith("/admin/stats", {
            headers: { Accept: "application/json" },
        });

        expect(result).toEqual(mockStats);
    });

    it("should propagate API error", async () => {
        const error = new Error("Unauthorized");

        (api.get as any).mockRejectedValueOnce(error);

        await expect(AdminStatsService.get()).rejects.toThrow("Unauthorized");
    });
});
