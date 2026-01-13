<template>
  <div class="app-page app-shell">
    <div class="app-container">
      <div class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-xl font-semibold">{{ t("admin.stats.title") }}</div>
            <div class="text-xs opacity-70">{{ t("admin.stats.subtitle") }}</div>
          </div>

          <button class="app-button-secondary" type="button" @click="s.fetchStats()" :disabled="isLoading">
            {{ t("common.actions.refresh") }}
          </button>
        </div>

        <div v-if="error" class="app-card p-3 text-sm text-red-500">
          {{ error }}
        </div>

        <div v-if="isLoading" class="text-sm opacity-70">
          {{ t("common.states.loading") }}
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="app-card p-4 space-y-1">
            <div class="text-xs opacity-70">{{ t("admin.stats.cards.users") }}</div>
            <div class="text-2xl font-semibold">{{ usersCount }}</div>
          </div>

          <div class="app-card p-4 space-y-1">
            <div class="text-xs opacity-70">{{ t("admin.stats.cards.activities") }}</div>
            <div class="text-2xl font-semibold">{{ activitiesCount }}</div>
          </div>

          <div class="app-card p-4 space-y-1">
            <div class="text-xs opacity-70">{{ t("admin.stats.cards.totalDistance") }}</div>
            <div class="text-2xl font-semibold">{{ formatDistance(totalDistance) }}</div>
            <div class="text-[11px] opacity-60">
              {{ t("admin.stats.rawValue", { value: totalDistance }) }}
            </div>
          </div>

          <div class="app-card p-4 space-y-1">
            <div class="text-xs opacity-70">{{ t("admin.stats.cards.totalTime") }}</div>
            <div class="text-2xl font-semibold">{{ formatTime(totalTime) }}</div>
            <div class="text-[11px] opacity-60">
              {{ t("admin.stats.rawValue", { value: totalTime }) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAdminStatsStore } from "../stores/adminStatsStore";
import { useI18n } from "../../../shared/composables/useI18n";

const { t } = useI18n();

const s = useAdminStatsStore();
const { isLoading, error, usersCount, activitiesCount, totalDistance, totalTime } = storeToRefs(s);

onMounted(() => {
  s.fetchStats();
});

function formatDistance(meters: number) {
  const m = Number(meters ?? 0);
  if (!Number.isFinite(m)) return "0 m";
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

function formatTime(seconds: number) {
  const s = Math.max(0, Math.floor(Number(seconds ?? 0)));
  if (!Number.isFinite(s)) return "0s";

  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;

  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
}
</script>
