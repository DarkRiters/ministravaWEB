import { api } from "../../../shared/services/http/api";
import type { UserDTO } from "../../user/domain/UserDTO";

export type Paginated<T> = {
    current_page: number;
    data: T[];
    last_page: number;
    per_page: number;
    total: number;
};

type ResourceCollection<T> = { data: T[] };
type LaravelPaginator<T> = Partial<Paginated<T>> & { data?: T[] };

export type UpdateUserPayload = {
    first_name?: string | null;
    last_name?: string | null;
    email?: string;

    birth_date?: string | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    avatar?: string | null;
};

export type CreateUserPayload = {
    first_name: string;
    last_name?: string | null;
    email: string;
    password: string;
    password_confirmation: string;
};

function normalizeUsersResponse<T>(
    res: ResourceCollection<T> | LaravelPaginator<T> | T[] | unknown,
    fallbackPage = 1,
    fallbackPerPage = 50
): Paginated<T> {
    if (Array.isArray(res)) {
        const data = res as T[];
        return {
            data,
            current_page: 1,
            last_page: 1,
            per_page: data.length || fallbackPerPage,
            total: data.length,
        };
    }

    const anyRes = res as any;

    if (anyRes && Array.isArray(anyRes.data) && anyRes.current_page == null) {
        const data = anyRes.data as T[];
        return {
            data,
            current_page: 1,
            last_page: 1,
            per_page: data.length || fallbackPerPage,
            total: data.length,
        };
    }

    if (anyRes && Array.isArray(anyRes.data)) {
        const data = anyRes.data as T[];
        return {
            data,
            current_page: Number(anyRes.current_page ?? fallbackPage),
            last_page: Number(anyRes.last_page ?? 1),
            per_page: Number(anyRes.per_page ?? fallbackPerPage),
            total: Number(anyRes.total ?? data.length),
        };
    }

    return {
        data: [],
        current_page: fallbackPage,
        last_page: 1,
        per_page: fallbackPerPage,
        total: 0,
    };
}

function isEmpty(v: unknown): boolean {
    return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

function normalizeEmail(v: unknown): string {
    return String(v ?? "").trim().toLowerCase();
}

function buildSafeUpdatePayload(payload: UpdateUserPayload, currentUser?: UserDTO): UpdateUserPayload {
    const out: UpdateUserPayload = { ...payload };

    // normalizacja pustych stringów
    if (out.first_name === "") out.first_name = null;
    if (out.last_name === "") out.last_name = null;
    if (out.birth_date === "") out.birth_date = null;
    if (out.gender === "") out.gender = null;
    if (out.avatar === "") out.avatar = null;

    if (isEmpty(out.email)) delete out.email;

    if (currentUser && out.email && normalizeEmail(out.email) === normalizeEmail(currentUser.email)) {
        delete out.email;
    }

    return out;
}

export class AdminService {
    static async listUsers(page = 1, perPage = 50): Promise<Paginated<UserDTO>> {
        const { data } = await api.get<ResourceCollection<UserDTO> | LaravelPaginator<UserDTO> | UserDTO[]>(
            "/admin/users",
            { headers: { Accept: "application/json" } }
        );

        return normalizeUsersResponse<UserDTO>(data, page, perPage);
    }

    static async updateUser(id: number, payload: UpdateUserPayload, currentUser?: UserDTO): Promise<UserDTO> {
        const safe = buildSafeUpdatePayload(payload, currentUser);

        console.log("[ADMIN] updateUser payload ->", { id, safe });

        const { data } = await api.put<UserDTO>(`/admin/users/${id}`, safe, {
            headers: { Accept: "application/json" },
        });

        console.log("[ADMIN] updateUser response <-", data);

        return data;
    }

    static async deleteUser(id: number): Promise<void> {
        await api.delete(`/admin/users/${id}`, { headers: { Accept: "application/json" } });
    }

    static async createUser(payload: CreateUserPayload): Promise<UserDTO> {
        const { data } = await api.post<UserDTO>("/admin/users", payload, {
            headers: { Accept: "application/json" },
        });
        return data;
    }

    static async canAccessAdmin(): Promise<boolean> {
        try {
            await api.get("/admin/users", { headers: { Accept: "application/json" } });
            return true;
        } catch {
            return false;
        }
    }
}

export function extractLaravelError(e: unknown, fallback: string): string {
    const err = e as any;

    const direct = err?.message;
    if (typeof direct === "string" && direct.trim()) return direct;

    const msg = err?.response?.data?.message;
    if (typeof msg === "string" && msg.trim()) return msg;

    const errors = err?.response?.data?.errors;
    if (errors && typeof errors === "object") {
        const rec = errors as Record<string, unknown>;
        const firstKey = Object.keys(rec)[0];
        if (firstKey) {
            const v = rec[firstKey];
            if (Array.isArray(v) && v[0]) return String(v[0]);
            if (typeof v === "string") return v;
        }
    }

    return fallback;
}
