<template>
  <div class="app-page app-shell">
    <div class="app-container">
      <!-- Header -->
      <div class="app-surface p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs opacity-70">{{ t("training.stats.title") }}</div>
            <h1 class="text-2xl font-semibold tracking-tight">
              {{ t("training.stats.title") }}
            </h1>

            <div v-if="store.stats" class="text-xs opacity-60">
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="app-button-secondary" @click="refresh" :disabled="store.isLoading">
              {{ store.isLoading ? t("common.loading") : t("common.refresh") }}
            </button>

            <button class="app-button-secondary" @click="goBack" :disabled="store.isLoading">
              {{ t("training.stats.actions.back") }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="store.isLoading && !store.stats" class="app-surface p-6 text-sm opacity-70">
        {{ t("common.loading") }}
      </div>

      <!-- Error -->
      <div
          v-else-if="store.error"
          class="app-surface p-6 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
      >
        <span class="font-medium">{{ t("common.error") }}:</span>
        {{ store.error?.message ?? String(store.error) }}
      </div>

      <!-- Content -->
      <template v-else-if="store.stats && store.overall">
        <!-- KPIs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="app-surface p-5">
            <div class="text-xs opacity-70">{{ t("training.stats.kpi.totalActivities") }}</div>
            <div class="mt-1 text-2xl font-semibold">{{ store.overall.activities }}</div>
          </div>

          <div class="app-surface p-5">
            <div class="text-xs opacity-70">{{ t("training.stats.kpi.totalTime") }}</div>
            <div class="mt-1 text-2xl font-semibold">
              {{ formatMinutes(store.overall.time_seconds) }}
            </div>
            <div class="mt-2 text-xs opacity-70">
              ({{ minutesToHoursLabel(store.overall.time_seconds) }})
            </div>
          </div>

          <div class="app-surface p-5">
            <div class="text-xs opacity-70">{{ t("training.stats.kpi.totalDistance") }}</div>
            <div class="mt-1 text-2xl font-semibold">
              {{ formatKm(store.overall.distance) }}
            </div>
            <div class="mt-2 text-xs opacity-70">
              ({{ kmToMetersLabel(store.overall.distance) }})
            </div>
          </div>
        </div>

        <!-- Overall types -->
        <div class="app-surface p-6 mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold">{{ t("training.stats.sections.typesOverall") }}</h2>
            <div class="text-xs opacity-60">{{ overallTypeRows.length }}</div>
          </div>

          <div v-if="overallTypeRows.length === 0" class="text-sm opacity-70">
            {{ t("training.stats.empty") }}
          </div>

          <div v-else class="space-y-2">
            <div
                v-for="row in overallTypeRows"
                :key="row.typeKey"
                class="app-surface app-surface-hover px-4 py-3"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 font-medium">
                    <span class="shrink-0">{{ row.emoji }}</span>
                    <span class="truncate">{{ row.label }}</span>
                  </div>
                  <div class="text-xs opacity-70 truncate">
                    {{ t("training.stats.entriesCount", { count: row.activities }) }}
                  </div>
                </div>

                <div class="text-xs opacity-70 shrink-0 text-right">
                  <div class="font-medium opacity-90">{{ formatKm(row.distanceKm) }}</div>
                  <div>{{ formatMinutes(row.timeMinutes) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Monthly -->
        <div class="app-surface p-6 mt-4 space-y-3">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold">{{ t("training.stats.sections.monthly") }}</h2>
            <div class="text-xs opacity-60">{{ store.monthly.length }}</div>
          </div>

          <div v-if="store.monthly.length === 0" class="text-sm opacity-70">
            {{ t("training.stats.monthlyEmpty") }}
          </div>

          <div v-else class="space-y-4">
            <div v-for="m in store.monthly" :key="m.month" class="app-surface px-4 py-4">
              <div class="flex items-center justify-between">
                <div class="font-semibold">{{ m.month }}</div>
                <div class="text-xs opacity-70">
                  {{ t("training.stats.entriesCount", { count: Number(m.activities ?? 0) }) }}
                </div>
              </div>

              <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div class="app-card p-3">
                  <div class="text-xs opacity-70">{{ t("training.stats.cards.distance") }}</div>
                  <div class="font-semibold">{{ formatKm(m.distance) }}</div>
                  <div class="text-xs opacity-60 mt-1">({{ kmToMetersLabel(m.distance) }})</div>
                </div>

                <div class="app-card p-3">
                  <div class="text-xs opacity-70">{{ t("training.stats.cards.time") }}</div>
                  <div class="font-semibold">{{ formatMinutes(m.time_seconds) }}</div>
                  <div class="text-xs opacity-60 mt-1">{{ minutesToHoursLabel(m.time_seconds) }}</div>
                </div>

                <div class="app-card p-3">
                  <div class="text-xs opacity-70">{{ t("training.stats.cards.avgSpeed") }}</div>
                  <div class="font-semibold">
                    {{ calcAvgSpeedKmh(m.distance, m.time_seconds).toFixed(1) }} km/h
                  </div>
                  <div class="text-xs opacity-60 mt-1">
                    {{ t("training.stats.cards.pace") }}:
                    {{ paceMinPerKm(calcAvgSpeedKmh(m.distance, m.time_seconds)) }} min/km
                  </div>
                </div>
              </div>

              <div class="mt-4 text-xs opacity-70">
                {{ t("training.stats.monthlyTypesCount", { count: Object.keys(m.types ?? {}).length }) }}
              </div>

              <div v-if="Object.keys(m.types ?? {}).length" class="mt-2 space-y-2">
                <div
                    v-for="(tv, typeKey) in m.types"
                    :key="typeKey"
                    class="app-surface app-surface-hover px-4 py-3"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 font-medium">
                        <span class="shrink-0">{{ typeMeta(typeKey).emoji }}</span>
                        <span class="truncate">{{ typeLabel(typeKey) }}</span>
                      </div>
                      <div class="text-xs opacity-70 truncate">
                        {{ t("training.stats.entriesCount", { count: Number(tv.activities ?? 0) }) }}
                      </div>
                    </div>

                    <div class="text-xs opacity-70 shrink-0 text-right">
                      <div class="font-medium opacity-90">{{ formatKm(tv.distance) }}</div>
                      <div>{{ formatMinutes(tv.time_seconds) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="app-surface p-6 text-sm opacity-70">
        {{ t("training.stats.empty") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "../../../shared/composables/useI18n";
import { useTrainingStatsStore } from "../stores/trainingStatsStore";
import { apiTypeToUiType, getTrainingTypeMeta } from "../domain/TrainingType";

const router = useRouter();
const { t } = useI18n();
const store = useTrainingStatsStore();

function toNumber(v: unknown): number {
  const n = typeof v === "string" ? Number(v) : (v as number);
  return Number.isFinite(n) ? n : 0;
}

function toMinutes(raw: unknown): number {
  return Math.max(0, Math.floor(toNumber(raw)));
}

function formatMinutes(minRaw: unknown): string {
  const totalMin = toMinutes(minRaw);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h} h ${m} min`;
  return `${m} min`;
}

function minutesToHoursLabel(minRaw: unknown): string {
  const totalMin = toMinutes(minRaw);
  const h = totalMin / 60;
  return `≈ ${h.toFixed(2)} h`;
}

function formatKm(kmRaw: unknown): string {
  const km = Math.max(0, toNumber(kmRaw));
  return `${km.toFixed(2)} km`;
}

function kmToMetersLabel(kmRaw: unknown): string {
  const km = Math.max(0, toNumber(kmRaw));
  const m = Math.round(km * 1000);
  return `${m} m`;
}

function calcAvgSpeedKmh(distanceKmRaw: unknown, timeMinutesRaw: unknown): number {
  const km = Math.max(0, toNumber(distanceKmRaw));
  const h = toMinutes(timeMinutesRaw) / 60;
  if (km <= 0 || h <= 0) return 0;
  return km / h;
}

function paceMinPerKm(speedKmh: number): string {
  if (speedKmh <= 0) return "--:--";
  const minPerKm = 60 / speedKmh;
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function typeMeta(apiType: unknown) {
  const uiType = apiTypeToUiType(apiType);
  return getTrainingTypeMeta(uiType);
}

function typeLabel(apiType: unknown): string {
  const meta = typeMeta(apiType);
  return t(meta.i18nKey);
}

const overallTypeRows = computed(() => {
  const map = store.overall?.types ?? {};
  return Object.entries(map)
      .map(([typeKey, v]) => {
        const meta = typeMeta(typeKey);
        return {
          typeKey,
          emoji: meta.emoji,
          label: t(meta.i18nKey),
          activities: Number((v as any)?.activities ?? 0),
          distanceKm: (v as any)?.distance ?? 0,
          timeMinutes: (v as any)?.time_seconds ?? 0,
        };
      })
      .sort((a, b) => b.activities - a.activities);
});

async function refresh() {
  await store.fetch();
}

function goBack() {
  router.push("/");
}

onMounted(async () => {
  if (!store.stats) await refresh();
});
</script>
