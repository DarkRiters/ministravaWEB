import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "../../../shared/services/http/api";
import {AdminService, extractLaravelError} from "./AdminService.ts";

vi.mock("../../../shared/services/http/api", () => ({
    api: {
        get: vi.fn(),
        put: vi.fn(),
        post: vi.fn(),
        delete: vi.fn(),
    },
}));

describe("AdminService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("listUsers", () => {
        it("should normalize when API returns array of users", async () => {
            const users = [
                { id: 1, email: "a@a.com", first_name: "A", last_name: "AA" },
                { id: 2, email: "b@b.com", first_name: "B", last_name: "BB" },
            ];

            (api.get as any).mockResolvedValueOnce({ data: users });

            const res = await AdminService.listUsers(1, 50);

            expect(api.get).toHaveBeenCalledOnce();
            expect(api.get).toHaveBeenCalledWith("/admin/users", {
                headers: { Accept: "application/json" },
            });

            expect(res).toEqual({
                data: users,
                current_page: 1,
                last_page: 1,
                per_page: users.length, // bo normalize ustawia length || fallbackPerPage
                total: users.length,
            });
        });

        it("should normalize when API returns ResourceCollection { data: [...] }", async () => {
            const users = [{ id: 1, email: "x@x.com" }];
            (api.get as any).mockResolvedValueOnce({ data: { data: users } });

            const res = await AdminService.listUsers(3, 99);

            // ResourceCollection bez current_page -> normalize traktuje jako "collection", page=1
            expect(res).toEqual({
                data: users,
                current_page: 1,
                last_page: 1,
                per_page: users.length || 99,
                total: users.length,
            });
        });

        it("should normalize when API returns Laravel paginator-like object", async () => {
            const users = [{ id: 10, email: "p@p.com" }];

            (api.get as any).mockResolvedValueOnce({
                data: {
                    current_page: 2,
                    data: users,
                    last_page: 5,
                    per_page: 50,
                    total: 201,
                },
            });

            const res = await AdminService.listUsers(2, 50);

            expect(res).toEqual({
                data: users,
                current_page: 2,
                last_page: 5,
                per_page: 50,
                total: 201,
            });
        });

        it("should fallback to empty pagination when response is unknown shape", async () => {
            (api.get as any).mockResolvedValueOnce({ data: { foo: "bar" } });

            const res = await AdminService.listUsers(7, 123);

            expect(res).toEqual({
                data: [],
                current_page: 7,
                last_page: 1,
                per_page: 123,
                total: 0,
            });
        });
    });

    describe("updateUser", () => {
        it("should not send email if same as current user (case/space insensitive)", async () => {
            (api.put as any).mockResolvedValueOnce({ data: { id: 5, email: "test@test.com" } });

            await AdminService.updateUser(
                5,
                {
                    email: "  TEST@Test.com ",
                    first_name: "A",
                },
                { id: 99, email: "test@test.com" } as any
            );

            const [url, safePayload] = (api.put as any).mock.calls[0];

            expect(url).toBe("/admin/users/5");
            expect(safePayload).toEqual({
                first_name: "A",
            });
        });

        it("should normalize empty string fields to null", async () => {
            (api.put as any).mockResolvedValueOnce({ data: { id: 2, email: "a@a.com" } });

            await AdminService.updateUser(
                2,
                {
                    first_name: "",
                    last_name: "",
                    birth_date: "",
                    gender: "",
                    avatar: "",
                },
                { id: 2, email: "a@a.com" } as any
            );

            const [, safePayload] = (api.put as any).mock.calls[0];

            expect(safePayload).toEqual({
                first_name: null,
                last_name: null,
                birth_date: null,
                gender: null,
                avatar: null,
            });
        });

        it("should send email if different than current user", async () => {
            (api.put as any).mockResolvedValueOnce({ data: { id: 7, email: "new@mail.com" } });

            const res = await AdminService.updateUser(
                7,
                { email: "new@mail.com", first_name: "Neo" },
                { id: 7, email: "old@mail.com" } as any
            );

            const [url, safePayload, config] = (api.put as any).mock.calls[0];

            expect(url).toBe("/admin/users/7");
            expect(safePayload).toEqual({ email: "new@mail.com", first_name: "Neo" });
            expect(config).toEqual({ headers: { Accept: "application/json" } });

            expect(res).toEqual({ id: 7, email: "new@mail.com" });
        });
    });

    describe("deleteUser", () => {
        it("should call DELETE with proper headers", async () => {
            (api.delete as any).mockResolvedValueOnce({ data: {} });

            await AdminService.deleteUser(123);

            expect(api.delete).toHaveBeenCalledOnce();
            expect(api.delete).toHaveBeenCalledWith("/admin/users/123", {
                headers: { Accept: "application/json" },
            });
        });
    });

    describe("createUser", () => {
        it("should POST and return created user", async () => {
            const payload = {
                first_name: "John",
                last_name: "Doe",
                email: "john@doe.com",
                password: "secret",
                password_confirmation: "secret",
            };

            const created = { id: 9, email: "john@doe.com", first_name: "John", last_name: "Doe" };

            (api.post as any).mockResolvedValueOnce({ data: created });

            const res = await AdminService.createUser(payload);

            expect(api.post).toHaveBeenCalledOnce();
            expect(api.post).toHaveBeenCalledWith("/admin/users", payload, {
                headers: { Accept: "application/json" },
            });

            expect(res).toEqual(created);
        });
    });

    describe("canAccessAdmin", () => {
        it("should return true when GET succeeds", async () => {
            (api.get as any).mockResolvedValueOnce({ data: {} });

            const res = await AdminService.canAccessAdmin();

            expect(res).toBe(true);
            expect(api.get).toHaveBeenCalledWith("/admin/users", {
                headers: { Accept: "application/json" },
            });
        });

        it("should return false when GET fails", async () => {
            (api.get as any).mockRejectedValueOnce(new Error("401"));

            const res = await AdminService.canAccessAdmin();

            expect(res).toBe(false);
        });
    });
});

describe("extractLaravelError", () => {
    it("should return direct error.message when present", () => {
        const e = { message: "Boom" };
        expect(extractLaravelError(e, "fallback")).toBe("Boom");
    });

    it("should return response.data.message when present", () => {
        const e = { response: { data: { message: "Laravel says no" } } };
        expect(extractLaravelError(e, "fallback")).toBe("Laravel says no");
    });

    it("should return first error from response.data.errors", () => {
        const e = { response: { data: { errors: { email: ["Email already exists"] } } } };
        expect(extractLaravelError(e, "fallback")).toBe("Email already exists");
    });

    it("should return string value from errors when it is string", () => {
        const e = { response: { data: { errors: { email: "Bad email" } } } };
        expect(extractLaravelError(e, "fallback")).toBe("Bad email");
    });

    it("should return fallback when nothing matches", () => {
        const e = { foo: "bar" };
        expect(extractLaravelError(e, "fallback text")).toBe("fallback text");
    });
});
