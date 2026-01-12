import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// 1) Mock api module used by AuthService
vi.mock("../../../shared/services/http/api", () => {
    return {
        api: {
            post: vi.fn(),
            put: vi.fn(),
        },
    };
});

import { api } from "../../../shared/services/http/api";
import { AuthService } from "./AuthService";

describe("AuthService", () => {
    const apiPost = api.post as unknown as ReturnType<typeof vi.fn>;
    const apiPut = api.put as unknown as ReturnType<typeof vi.fn>;

    beforeEach(() => {
        // Force non-mock branch inside AuthService (useMock() === false)
        // vitest supports stubbing import.meta.env
        vi.stubEnv("VITE_USE_MOCK", "false");

        apiPost.mockReset();
        apiPut.mockReset();
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it("login() calls /login and returns user+token", async () => {
        apiPost.mockResolvedValueOnce({
            data: {
                message: "ok",
                token: "t123",
                user: {
                    id: 7,
                    name: "John",
                    email: "john@example.com",
                    email_verified_at: null,
                    is_admin: false,
                    created_at: "2020-01-01T00:00:00.000Z",
                    updated_at: "2020-01-01T00:00:00.000Z",
                },
            },
        });

        const res = await AuthService.login("john@example.com", "secret");

        expect(apiPost).toHaveBeenCalledTimes(1);
        expect(apiPost).toHaveBeenCalledWith("/login", { email: "john@example.com", password: "secret" });

        expect(res.token).toBe("t123");
        expect(res.user).toMatchObject({
            id: 7,
            name: "John",
            email: "john@example.com",
        });
    });

    it("register() calls /register and returns message+user", async () => {
        apiPost.mockResolvedValueOnce({
            data: {
                message: "created",
                user: {
                    id: 2,
                    name: "Ala",
                    email: "ala@example.com",
                    email_verified_at: null,
                    is_admin: false,
                    created_at: "2020-01-01T00:00:00.000Z",
                    updated_at: "2020-01-01T00:00:00.000Z",
                },
            },
        });

        const res = await AuthService.register("Ala", "ala@example.com", "pass12345");

        expect(apiPost).toHaveBeenCalledTimes(1);
        expect(apiPost).toHaveBeenCalledWith("/register", {
            name: "Ala",
            email: "ala@example.com",
            password: "pass12345",
        });

        expect(res.message).toBe("created");
        expect(res.user).toMatchObject({ id: 2, name: "Ala", email: "ala@example.com" });
    });

    it("requestPasswordReset() posts to /forgot-password", async () => {
        apiPost.mockResolvedValueOnce({ data: {} });

        await AuthService.requestPasswordReset("x@y.com");

        expect(apiPost).toHaveBeenCalledTimes(1);
        expect(apiPost).toHaveBeenCalledWith("/forgot-password", { email: "x@y.com" });
    });

    it("resetPassword() posts to /reset-password with payload", async () => {
        apiPost.mockResolvedValueOnce({ data: {} });

        const payload = {
            token: "tok",
            email: "x@y.com",
            password: "newpass123",
            password_confirmation: "newpass123",
        };

        await AuthService.resetPassword(payload);

        expect(apiPost).toHaveBeenCalledTimes(1);
        expect(apiPost).toHaveBeenCalledWith("/reset-password", payload);
    });

    it("updateProfile() normalizes when backend returns { data: {...} }", async () => {
        apiPut.mockResolvedValueOnce({
            data: {
                message: "ok",
                data: {
                    id: 10,
                    name: "Neo",
                    email: "neo@matrix.com",
                    email_verified_at: null,
                    is_admin: 1,
                    created_at: "2022-02-02T02:02:02.000Z",
                    updated_at: "2022-03-03T03:03:03.000Z",
                },
            },
        });

        const user = await AuthService.updateProfile({ name: "Neo", email: "neo@matrix.com" });

        expect(apiPut).toHaveBeenCalledTimes(1);
        expect(apiPut).toHaveBeenCalledWith(
            "/profile",
            { name: "Neo", email: "neo@matrix.com" },
            { headers: { Accept: "application/json" } }
        );

        expect(user).toEqual({
            id: 10,
            name: "Neo",
            email: "neo@matrix.com",
            email_verified_at: null,
            is_admin: true,
            created_at: "2022-02-02T02:02:02.000Z",
            updated_at: "2022-03-03T03:03:03.000Z",
        });
    });

    it("updateProfile() fills created_at/updated_at when missing", async () => {
        // freeze time so nowIso() is deterministic
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));

        apiPut.mockResolvedValueOnce({
            data: {
                id: 11,
                name: "Trinity",
                email: "tri@matrix.com",
                // created_at missing
                // updated_at missing
            },
        });

        const user = await AuthService.updateProfile({ name: "Trinity", email: "tri@matrix.com" });

        expect(user.created_at).toBe("2026-01-01T00:00:00.000Z");
        expect(user.updated_at).toBe("2026-01-01T00:00:00.000Z");

        vi.useRealTimers();
    });
});
