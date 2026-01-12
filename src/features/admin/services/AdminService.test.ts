import { describe, it, expect, vi, beforeEach } from "vitest";

// mock api instance used inside AdminService
vi.mock("../../../shared/services/http/api", () => {
    return {
        api: {
            get: vi.fn(),
            post: vi.fn(),
            put: vi.fn(),
            delete: vi.fn(),
        },
    };
});

import { api } from "../../../shared/services/http/api.ts";
import {AdminService, extractLaravelError} from "./AdminService.ts";

describe("AdminService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("listUsers() handles ResourceCollection<T> {data: []} without paginator meta", async () => {
        (api.get as any).mockResolvedValueOnce({
            data: { data: [{ id: 1, name: "A", email: "a@a.pl" }] },
        });

        const res = await AdminService.listUsers(1, 50);
        expect(res.data).toHaveLength(1);
        expect(res.current_page).toBe(1);
        expect(res.last_page).toBe(1);
        expect(res.total).toBe(1);
    });

    it("listUsers() handles Laravel paginator shape", async () => {
        (api.get as any).mockResolvedValueOnce({
            data: {
                current_page: 2,
                last_page: 5,
                per_page: 10,
                total: 42,
                data: [{ id: 2, name: "B", email: "b@b.pl" }],
            },
        });

        const res = await AdminService.listUsers(2, 10);
        expect(res.current_page).toBe(2);
        expect(res.last_page).toBe(5);
        expect(res.per_page).toBe(10);
        expect(res.total).toBe(42);
    });

    it("listUsers() handles plain array response", async () => {
        (api.get as any).mockResolvedValueOnce({
            data: [{ id: 3, name: "C", email: "c@c.pl" }],
        });

        const res = await AdminService.listUsers(1, 50);
        expect(res.data).toHaveLength(1);
        expect(res.total).toBe(1);
    });

    it("canAccessAdmin() returns true when listUsers succeeds", async () => {
        (api.get as any).mockResolvedValueOnce({ data: { data: [] } });

        const ok = await AdminService.canAccessAdmin();
        expect(ok).toBe(true);
    });

    it("canAccessAdmin() returns false when listUsers throws (403 etc.)", async () => {
        (api.get as any).mockRejectedValueOnce(new Error("403"));

        const ok = await AdminService.canAccessAdmin();
        expect(ok).toBe(false);
    });
});

describe("extractLaravelError", () => {
    it("returns response.data.message when present", () => {
        const e = { response: { data: { message: "Nope" } } };
        expect(extractLaravelError(e, "fallback")).toBe("Nope");
    });

    it("returns first errors.<field>[0] when present", () => {
        const e = { response: { data: { errors: { email: ["Bad email"] } } } };
        expect(extractLaravelError(e, "fallback")).toBe("Bad email");
    });

    it("returns err.message when present", () => {
        const e = { message: "Boom" };
        expect(extractLaravelError(e, "fallback")).toBe("Boom");
    });

    it("returns fallback otherwise", () => {
        expect(extractLaravelError({}, "fallback")).toBe("fallback");
    });
});
