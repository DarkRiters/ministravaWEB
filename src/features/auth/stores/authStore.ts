import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { User } from "../../user/domain/User";
import type { UserDTO } from "../../user/domain/UserDTO";
import { UserFactory } from "../../user/domain/UserFactory";

import { AuthService } from "../services/AuthService";
import { setAuthToken, getAuthToken, type ApiError } from "../../../shared/services/http/api";

const USER_KEY = "silex.auth.user";

function isUnauthorized(err: unknown): boolean {
    const e = err as Partial<ApiError> | undefined;
    return e?.status === 401 || e?.status === 419;
}

export const useAuthStore = defineStore("auth", () => {
    const currentUser = ref<User | null>(null);

    const isAdmin = computed(() => currentUser.value?.role === "admin");

    const isLoggedIn = computed(() => currentUser.value !== null && !!getAuthToken());

    function clearSession() {
        currentUser.value = null;
        localStorage.removeItem(USER_KEY);
        setAuthToken(null);
    }

    function hydrateFromStorage() {
        const rawUser = localStorage.getItem(USER_KEY);
        const token = getAuthToken();

        if (!rawUser || !token) {
            clearSession();
            return;
        }

        try {
            const dto = JSON.parse(rawUser) as UserDTO;
            currentUser.value = UserFactory.fromApi(dto);
        } catch {
            clearSession();
        }
    }

    function setSession(dto: UserDTO, token: string) {
        currentUser.value = UserFactory.fromApi(dto);
        localStorage.setItem(USER_KEY, JSON.stringify(dto));
        setAuthToken(token);
    }

    function setUser(dto: UserDTO) {
        currentUser.value = UserFactory.fromApi(dto);
        localStorage.setItem(USER_KEY, JSON.stringify(dto));
    }

    async function login(email: string, password: string) {
        const { user, token } = await AuthService.login(email, password);
        setSession(user, token);
    }

    async function register(name: string, email: string, password: string): Promise<{ message: string }> {
        const res = await AuthService.register(name, email, password);
        return { message: res.message || "Konto utworzone. Sprawdź email i kliknij link weryfikacyjny." };
    }

    async function requestPasswordReset(email: string) {
        await AuthService.requestPasswordReset(email);
    }

    async function refreshMe() {
        return;
    }

    async function updateProfile(payload: { name?: string; email?: string }) {
        const token = getAuthToken();
        if (!token) throw new Error("Brak tokenu. Zaloguj się ponownie.");

        try {
            const dto = await AuthService.updateProfile(payload);
            setUser(dto);
        } catch (err) {
            if (isUnauthorized(err)) clearSession();
            throw err;
        }
    }


    async function changePassword(payload: {
        currentPassword: string;
        newPassword: string;
        newPasswordConfirm: string;
    }) {
        const token = getAuthToken();
        if (!token) throw new Error("Brak tokenu. Zaloguj się ponownie.");

        try {
            await AuthService.changePassword({
                current_password: payload.currentPassword,
                new_password: payload.newPassword,
                new_password_confirmation: payload.newPasswordConfirm,
            });
        } catch (err) {
            if (isUnauthorized(err)) clearSession();
            throw err;
        }
    }

    async function logout() {
        try {
            await AuthService.logout();
        } finally {
            clearSession();
        }
    }

    hydrateFromStorage();

    return {
        currentUser,
        isLoggedIn,
        isAdmin,

        hydrateFromStorage,
        clearSession,

        login,
        register,
        requestPasswordReset,
        refreshMe,

        updateProfile,
        changePassword,

        logout,
    };
});

export const authStore = useAuthStore;
export type AuthStore = ReturnType<typeof useAuthStore>;
