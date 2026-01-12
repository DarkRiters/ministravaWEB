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
    name?: string;
    email?: string;
};

export type CreateUserPayload = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

function normalizePaginated<T>(
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


export class AdminService {
    static async listUsers(page = 1, perPage = 50): Promise<Paginated<UserDTO>> {
        const { data } = await api.get<ResourceCollection<UserDTO> | LaravelPaginator<UserDTO> | UserDTO[]>(
            "/admin/users",
            { params: { page, per_page: perPage }, headers: { Accept: "application/json" } }
        );

        return normalizePaginated<UserDTO>(data, page, perPage);
    }


    static async updateUser(id: number, payload: UpdateUserPayload): Promise<UserDTO> {
        const { data } = await api.put<UserDTO>(`/admin/users/${id}`, payload, {
            headers: { Accept: "application/json" },
        });
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
            await this.listUsers(1, 1);
            return true;
        } catch {
            return false;
        }
    }
}

export function extractLaravelError(e: unknown, fallback: string): string {
    const err = e as any;

    const msg: unknown = err?.response?.data?.message;
    if (typeof msg === "string" && msg.trim().length) return msg;

    const errors: unknown = err?.response?.data?.errors;

    if (errors && typeof errors === "object") {
        const rec = errors as Record<string, unknown>;
        const keys = Object.keys(rec);

        if (keys.length > 0) {
            const firstKey = keys[0] as string;
            const firstVal = rec[firstKey];

            if (Array.isArray(firstVal) && firstVal[0]) return String(firstVal[0]);
            if (typeof firstVal === "string") return firstVal;
        }
    }

    const plain: unknown = err?.message;
    if (typeof plain === "string" && plain.trim().length) return plain;

    return fallback;
}
