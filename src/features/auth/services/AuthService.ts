import { api } from "../../../shared/services/http/api";
import type { UserDTO } from "../../user/domain/UserDTO";

type LoginResponse = { message: string; token: string; user: UserDTO };
type RegisterResponse = { message: string; user: UserDTO };

type UpdateProfileResponse =
    | { message?: string; data?: Partial<UserDTO> & { id: number; name: string; email: string } }
    | (Partial<UserDTO> & { id: number; name: string; email: string });

export type UpdateProfilePayload = Partial<{
    name: string;
    email: string;
}>;

export type ChangePasswordPayload = {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
};

function useMock(): boolean {
    return String(import.meta.env.VITE_USE_MOCK).toLowerCase() === "true";
}

function nowIso(): string {
    return new Date().toISOString();
}

function normalizeUserDto(input: any): UserDTO {
    const u = input?.data ?? input;

    const createdAt = u?.created_at ?? nowIso();
    const updatedAt = u?.updated_at ?? createdAt;

    return {
        id: Number(u.id),
        name: String(u.name ?? ""),
        email: String(u.email ?? ""),
        email_verified_at: u.email_verified_at ?? null,
        is_admin: Boolean(u.is_admin ?? false),
        created_at: String(createdAt),
        updated_at: String(updatedAt),
    };
}

export class AuthService {
    static async login(email: string, password: string): Promise<{ user: UserDTO; token: string }> {
        if (useMock()) {
            const now = nowIso();
            return {
                user: { id: 1, name: email.split("@")[0] || "User", email, created_at: now, updated_at: now },
                token: "fake-token",
            };
        }

        const { data } = await api.post<LoginResponse>("/login", { email, password });
        return { user: data.user, token: data.token };
    }

    static async register(name: string, email: string, password: string): Promise<{ message: string; user: UserDTO }> {
        if (useMock()) {
            const now = nowIso();
            return {
                message: "Konto utworzone (mock). Sprawdź email i kliknij link weryfikacyjny.",
                user: { id: 1, name, email, created_at: now, updated_at: now },
            };
        }

        const { data } = await api.post<RegisterResponse>("/register", { name, email, password });
        return { message: data.message, user: data.user };
    }

    static async requestPasswordReset(email: string): Promise<void> {
        if (useMock()) return;
        await api.post("/forgot-password", { email });
    }

    static async resetPassword(payload: { token: string; email: string; password: string; password_confirmation: string }) {
        if (useMock()) return;
        await api.post("/reset-password", payload);
    }

    static async me(): Promise<UserDTO> {
        throw new Error("ME_DISABLED: backend /user returns 500 (wrong return type).");
    }

    static async updateProfile(payload: UpdateProfilePayload): Promise<UserDTO> {
        if (useMock()) {
            const now = nowIso();
            return {
                id: 1,
                name: String(payload.name ?? "User"),
                email: String(payload.email ?? "user@example.com"),
                created_at: now,
                updated_at: now,
            } as any;
        }

        const body: Record<string, any> = {};
        if (typeof payload.name === "string") body.name = payload.name;
        if (typeof payload.email === "string") body.email = payload.email;

        const res = await api.put<UpdateProfileResponse>("/profile", body, {
            headers: { Accept: "application/json" },
        });

        return normalizeUserDto(res.data);
    }

    static async changePassword(payload: ChangePasswordPayload): Promise<void> {
        if (useMock()) return;

        await api.put(
            "/auth/change-password",
            {
                current_password: payload.current_password,
                new_password: payload.new_password,
                new_password_confirmation: payload.new_password_confirmation,
            },
            { headers: { Accept: "application/json" } }
        );
    }

    static async logout(): Promise<void> {
        if (useMock()) return;
        await api.post("/logout");
    }
}
