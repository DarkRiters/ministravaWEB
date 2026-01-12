import axios, { AxiosError } from "axios";

export const TOKEN_KEY = "silex.auth.token";

export type ApiError = {
    status: number;
    code: string;
    message: string;
};

export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "/api",
    withCredentials: false,
});

api.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err: AxiosError<any>) => {
        const status = err.response?.status ?? 0;
        const data = err.response?.data;

        const apiError: ApiError = {
            status,
            code: data?.code || "UNKNOWN_ERROR",
            message: data?.message || err.message || "Request failed",
        };

        return Promise.reject(apiError);
    }
);
