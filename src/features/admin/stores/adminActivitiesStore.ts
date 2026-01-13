import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { AdminActivityService, type AdminActivity } from "../services/AdminActivityService";

type Filters = {
    q: string;
    userId: number | null;
    type: string | null;

    dateFrom: string | null;
    dateTo: string | null;

    distanceMin: number | null;
    distanceMax: number | null;

    timeMin: number | null;
    timeMax: number | null;
};

function toDateOnly(iso: string): string {
    return String(iso ?? "").slice(0, 10);
}

function safeLower(v: unknown) {
    return String(v ?? "").toLowerCase();
}

function toNumOrZero(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

export const useAdminActivitiesStore = defineStore("adminActivities", () => {
    const items = ref<AdminActivity[]>([]);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const filters = ref<Filters>({
        q: "",
        userId: null,
        type: null,
        dateFrom: null,
        dateTo: null,
        distanceMin: null,
        distanceMax: null,
        timeMin: null,
        timeMax: null,
    });

    async function fetchAll() {
        isLoading.value = true;
        error.value = null;

        try {
            const res = await AdminActivityService.listAll();
            items.value = Array.isArray(res) ? res : res?.data ?? [];
        } catch (e: any) {
            error.value = e?.response?.data?.message ?? e?.message ?? "Nie udało się pobrać aktywności.";
            items.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function remove(id: number) {
        const snapshot = items.value.slice();
        items.value = items.value.filter((x) => x.id !== id);

        try {
            await AdminActivityService.delete(id);
        } catch (e) {
            items.value = snapshot;
            throw e;
        }
    }

    const uniqueUsers = computed(() => {
        const map = new Map<number, { id: number; label: string }>();

        for (const a of items.value) {
            const u = a.user;
            const label = u
                ? `${u.email}${
                    u.first_name || u.last_name
                        ? ` (${`${(u.first_name ?? "").trim()} ${(u.last_name ?? "").trim()}`.trim()})`
                        : ""
                }`
                : `User #${a.user_id}`;

            map.set(a.user_id, { id: a.user_id, label });
        }

        return Array.from(map.values()).sort((x, y) => x.label.localeCompare(y.label));
    });

    const uniqueTypes = computed(() => {
        const set = new Set<string>();
        for (const a of items.value) {
            const t = String(a.type ?? "").trim();
            if (t) set.add(t);
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    });

    const filtered = computed(() => {
        const f = filters.value;

        const q = safeLower(f.q).trim();
        const hasQ = q.length > 0;

        return items.value.filter((a) => {
            if (f.userId != null && a.user_id !== f.userId) return false;
            if (f.type && a.type !== f.type) return false;

            const d = toDateOnly(a.created_at);
            if (f.dateFrom && d < f.dateFrom) return false;
            if (f.dateTo && d > f.dateTo) return false;

            const dist = toNumOrZero(a.distance);
            if (f.distanceMin != null && dist < f.distanceMin) return false;
            if (f.distanceMax != null && dist > f.distanceMax) return false;

            const t = toNumOrZero(a.time);
            if (f.timeMin != null && t < f.timeMin) return false;
            if (f.timeMax != null && t > f.timeMax) return false;

            if (hasQ) {
                const hay = [
                    a.name,
                    a.note,
                    a.type,
                    a.user?.email,
                    a.user?.first_name,
                    a.user?.last_name,
                    a.user_id,
                    a.id,
                ]
                    .map(safeLower)
                    .join(" ");

                if (!hay.includes(q)) return false;
            }

            return true;
        });
    });

    function setFilters(patch: Partial<Filters>) {
        filters.value = { ...filters.value, ...patch };
    }

    function resetFilters() {
        filters.value = {
            q: "",
            userId: null,
            type: null,
            dateFrom: null,
            dateTo: null,
            distanceMin: null,
            distanceMax: null,
            timeMin: null,
            timeMax: null,
        };
    }

    return {
        items,
        isLoading,
        error,
        filters,

        filtered,
        uniqueUsers,
        uniqueTypes,

        fetchAll,
        remove,
        setFilters,
        resetFilters,
    };
});
