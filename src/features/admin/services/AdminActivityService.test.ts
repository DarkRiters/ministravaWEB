import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "../../../shared/services/http/api";
import {AdminActivityService} from "./AdminActivityService.ts";

// 🔧 mock całego api (axios instance)
vi.mock("../../../shared/services/http/api", () => ({
    api: {
        get: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("AdminActivityService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("listAll", () => {
        it("should return collection with activities", async () => {
            const mockResponse = {
                data: {
                    data: [
                        {
                            id: 1,
                            user_id: 10,
                            name: "Morning Run",
                            type: "run",
                            distance: 5,
                            time: 1800,
                            created_at: "2026-01-01T10:00:00Z",
                            user: {
                                id: 10,
                                email: "test@test.com",
                                first_name: "John",
                                last_name: "Doe",
                            },
                        },
                    ],
                },
            };

            (api.get as any).mockResolvedValueOnce(mockResponse);

            const result = await AdminActivityService.listAll();

            expect(api.get).toHaveBeenCalledOnce();
            expect(api.get).toHaveBeenCalledWith("/admin/activities");
            expect(result).toEqual(mockResponse.data);
        });

        it("should return plain array when API returns array", async () => {
            const mockResponse = {
                data: [
                    {
                        id: 2,
                        user_id: 11,
                        name: "Cycling",
                        type: "bike",
                        created_at: "2026-01-02T12:00:00Z",
                    },
                ],
            };

            (api.get as any).mockResolvedValueOnce(mockResponse);

            const result = await AdminActivityService.listAll();

            expect(Array.isArray(result)).toBe(true);
            expect(result).toEqual(mockResponse.data);
        });
    });

    describe("delete", () => {
        it("should delete activity and return message", async () => {
            const mockResponse = {
                data: {
                    message: "Aktywność została usunięta",
                },
            };

            (api.delete as any).mockResolvedValueOnce(mockResponse);

            const result = await AdminActivityService.delete(5);

            expect(api.delete).toHaveBeenCalledOnce();
            expect(api.delete).toHaveBeenCalledWith("/admin/activities/5");
            expect(result).toEqual(mockResponse.data);
        });
    });
});
