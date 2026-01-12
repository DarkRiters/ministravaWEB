import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { UserDTO } from "../../user/domain/UserDTO";
import {
    AdminService,
    type Paginated,
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

    async function fetchUsers(p = page.value) {
        error.value = null;
        isLoading.value = true;

        try {
            const res: Paginated<UserDTO> = await AdminService.listUsers(p, perPage.value);

            users.value = Array.isArray(res.data) ? res.data : [];
            page.value = Number(res.current_page ?? p);
            lastPage.value = Number(res.last_page ?? 1);
            total.value = Number(res.total ?? users.value.length);
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
            await fetchUsers(page.value);
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not delete user.");
            throw e;
        }
    }

    async function updateUser(id: number, payload: UpdateUserPayload) {
        error.value = null;

        try {
            await AdminService.updateUser(id, payload);
            await fetchUsers(page.value);
        } catch (e: unknown) {
            error.value = extractLaravelError(e, "Could not update user.");
            throw e;
        }
    }

    async function createUser(payload: CreateUserPayload) {
        error.value = null;

        try {
            await AdminService.createUser(payload);
            await fetchUsers(1);
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
