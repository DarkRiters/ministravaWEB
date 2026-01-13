import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { UserDTO } from "../../user/domain/UserDTO";
import {
    AdminService,
    type UpdateUserPayload,
    type CreateUserPayload,
    extractLaravelError,
} from "../services/AdminService";

export const useAdminStore = defineStore("admin", () => {
    const users = ref<UserDTO[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const page = ref(1);
    const lastPage = ref(1);
    const perPage = ref(50);
    const total = ref(0);

    const hasPrev = computed(() => page.value > 1);
    const hasNext = computed(() => page.value < lastPage.value);

    async function fetchUsers() {
        error.value = null;
        isLoading.value = true;

        try {
            const res = await AdminService.listUsers(1, perPage.value);
            users.value = Array.isArray(res.data) ? res.data : [];
            total.value = users.value.length;

            page.value = 1;
            lastPage.value = 1;
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not load users.");
            users.value = [];
            total.value = 0;
            page.value = 1;
            lastPage.value = 1;
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteUser(id: number) {
        error.value = null;
        try {
            await AdminService.deleteUser(id);
            await fetchUsers();
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not delete user.");
            throw e;
        }
    }

    async function updateUser(id: number, payload: UpdateUserPayload) {
        error.value = null;
        try {
            const currentUser = users.value.find((u) => u.id === id);
            await AdminService.updateUser(id, payload, currentUser);
            await fetchUsers();
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not update user.");
            throw e;
        }
    }

    async function createUser(payload: CreateUserPayload) {
        error.value = null;
        try {
            await AdminService.createUser(payload);
            await fetchUsers();
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not create user.");
            throw e;
        }
    }

    return {
        users,
        isLoading,
        error,
        page,
        lastPage,
        perPage,
        total,
        hasPrev,
        hasNext,
        fetchUsers,
        deleteUser,
        updateUser,
        createUser,
    };
});
