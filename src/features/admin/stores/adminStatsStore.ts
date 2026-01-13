import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AdminStatsService, type AdminStatsDTO } from "../services/AdminStatsService";

export const useAdminStatsStore = defineStore("adminStats", () => {
    const stats = ref<AdminStatsDTO | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    async function fetchStats() {
        isLoading.value = true;
        error.value = null;

        try {
            stats.value = await AdminStatsService.get();
        } catch (e: any) {
            error.value = e?.response?.data?.message ?? e?.message ?? "Nie udało się pobrać statystyk.";
            stats.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    const usersCount = computed(() => stats.value?.users_count ?? 0);
    const activitiesCount = computed(() => stats.value?.activities_count ?? 0);
    const totalDistance = computed(() => stats.value?.total_distance ?? 0);
    const totalTime = computed(() => stats.value?.total_time ?? 0);

    return {
        stats,
        isLoading,
        error,
        fetchStats,
        usersCount,
        activitiesCount,
        totalDistance,
        totalTime,
    };
});
