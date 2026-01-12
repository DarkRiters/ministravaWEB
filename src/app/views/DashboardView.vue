<template>
  <div class="app-page app-shell">
    <div class="app-container">
      <!-- Header -->
      <div class="app-surface p-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs opacity-70">{{ subtitle }}</div>
            <h1 class="text-2xl font-semibold tracking-tight">
              {{ title }}
            </h1>
          </div>

          <div class="flex flex-wrap gap-2">
            <button class="app-button-secondary" @click="refresh" :disabled="busy">
              {{ busy ? t("common.loading") : t("common.refresh") }}
            </button>

            <button class="app-button" @click="goCreate" :disabled="!auth.isLoggedIn">
              + {{ t("training.addNew") }}
            </button>
          </div>
        </div>
      </div>

      <!-- KPIs (GLOBAL) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="app-surface p-5">
          <div class="text-xs opacity-70">{{ t("training.stats.totalTrainings") }}</div>
          <div class="mt-1 text-2xl font-semibold">{{ totalTrainings }}</div>
          <div class="mt-3 flex items-center gap-2 text-xs opacity-70">
            <span class="app-badge">📌</span>
            <span>{{ t("dashboard.kpi.hint") }}</span>
          </div>
        </div>

        <div class="app-surface p-5">
          <div class="text-xs opacity-70">{{ t("training.stats.totalDuration") }}</div>
          <div class="mt-1 text-2xl font-semibold">{{ totalDuration }}</div>
          <div class="mt-3 text-xs opacity-70">
            {{ t("dashboard.subtitle.loggedIn") }}
          </div>
        </div>

        <div class="app-surface p-5">
          <div class="text-xs opacity-70">{{ t("training.details.summary.totalDistance") }}</div>
          <div class="mt-1 text-2xl font-semibold">{{ totalDistance }}</div>
          <div class="mt-3 text-xs opacity-70">
            {{ t("dashboard.subtitle.loggedIn") }}
          </div>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Recent trainings -->
        <div class="lg:col-span-2 app-surface p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-base font-semibold">{{ t("dashboard.section.recent") }}</h2>
            <RouterLink class="app-link text-sm" to="/trainings">
              {{ t("dashboard.section.open") }}
            </RouterLink>
          </div>

          <div class="mt-4">
            <div v-if="!auth.isLoggedIn" class="text-sm opacity-70">
              {{ t("dashboard.recent.loginHint") }}
            </div>

            <div v-else-if="trainingStore.isLoading" class="text-sm opacity-70">
              {{ t("common.loading") }}
            </div>

            <div
                v-else-if="trainingStore.error"
                class="app-surface p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
            >
              <span class="font-medium">{{ t("common.error") }}:</span>
              {{ trainingStore.error.message }}
            </div>

            <div v-else-if="recentTrainings.length === 0" class="text-sm opacity-70">
              {{ t("dashboard.recent.empty", { cta: t("training.addNew") }) }}
            </div>

            <div v-else class="space-y-2">
              <button
                  v-for="tr in recentTrainings"
                  :key="tr.id"
                  type="button"
                  class="w-full text-left app-surface app-surface-hover px-4 py-3"
                  @click="openTraining(tr.id)"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 font-medium">
                      <span class="shrink-0">{{ meta(tr.type).emoji }}</span>
                      <span class="truncate">{{ tr.name }}</span>
                    </div>
                    <div class="text-xs opacity-70 truncate">
                      {{ t(meta(tr.type).i18nKey) }}
                    </div>
                  </div>

                  <div class="text-xs opacity-70 shrink-0">
                    {{ t("dashboard.section.open") }}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Quick actions / status -->
        <div class="app-surface p-6 space-y-4">
          <h2 class="text-base font-semibold">{{ t("dashboard.section.quick") }}</h2>
          <RouterLink class="app-button-secondary w-full justify-start px-4 py-3 text-left" to="/trainings/stats">
            <div>
              <div class="font-medium">{{ t("training.stats.open") }}</div>
              <div class="text-xs opacity-70">{{ t("training.stats.openHint") }}</div>
            </div>
          </RouterLink>


          <div class="grid grid-cols-1 gap-2">
            <button class="app-button-secondary w-full justify-start px-4 py-3 text-left" @click="goProfile">
              <div>
                <div class="font-medium">{{ t("dashboard.quick.profile.title") }}</div>
                <div class="text-xs opacity-70">{{ t("dashboard.quick.profile.subtitle") }}</div>
              </div>
            </button>

            <button class="app-button-secondary w-full justify-start px-4 py-3 text-left" @click="toggleTheme">
              <div>
                <div class="font-medium">{{ t("dashboard.quick.theme.title") }}</div>
                <div class="text-xs opacity-70">
                  {{ t("dashboard.quick.theme.current", { value: themeLabel }) }}
                </div>
              </div>
            </button>

            <button class="app-button-secondary w-full justify-start px-4 py-3 text-left" @click="toggleLocale">
              <div>
                <div class="font-medium">{{ t("dashboard.quick.locale.title") }}</div>
                <div class="text-xs opacity-70">
                  {{ t("dashboard.quick.locale.current", { value: locale.toUpperCase() }) }}
                </div>
              </div>
            </button>
          </div>

          <div class="pt-4 app-divider">
            <div class="text-xs opacity-70 mb-2">{{ t("dashboard.status.title") }}</div>

            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="opacity-80">{{ t("dashboard.status.loggedIn") }}</span>
                <span class="font-medium">{{ auth.isLoggedIn ? "Tak" : "Nie" }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="opacity-80">{{ t("dashboard.status.user") }}</span>
                <span class="font-medium truncate max-w-[180px]">{{ displayName }}</span>
              </div>

              <div v-if="isAdmin" class="flex items-center justify-between">
                <span class="opacity-80">{{ t("dashboard.status.role") }}</span>
                <span class="app-badge">{{ t("dashboard.status.admin") }}</span>
              </div>

              <RouterLink v-if="isAdmin" class="app-link text-sm" to="/admin/users">
                {{ t("dashboard.status.adminPanel") }}
              </RouterLink>
            </div>
          </div>

          <!-- GLOBAL AVG SPEED -->
          <div class="pt-4 app-divider">
            <div class="text-xs opacity-70 mb-2">{{ t("training.details.summary.avgSpeed") }}</div>

            <div class="space-y-1 text-sm">
              <div class="flex items-center justify-between">
                <span class="opacity-80">{{ t("dashboard.stats.avgSpeedLabel") }}</span>
                <span class="font-medium">{{ avgSpeedKmh.toFixed(1) }} km/h</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="opacity-80">{{ t("training.details.summary.avgPace") }}</span>
                <span class="font-medium">{{ avgPace }} min/km</span>
              </div>

              <div class="text-xs opacity-60">
                {{ t("dashboard.stats.globalNote") }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

import { useI18n } from "../../shared/composables/useI18n";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { useTrainingStore } from "../../features/training/stores/trainingStore";
import { useTheme } from "../../shared/composables/useTheme";
import { useLocale } from "../../shared/composables/useLocale";
import { getTrainingTypeMeta } from "../../features/training/utils/trainingTypeMeta";

const router = useRouter();

const { t } = useI18n();
const auth = useAuthStore();
const trainingStore = useTrainingStore();

const { theme, toggleTheme } = useTheme();
const { locale, setLocale } = useLocale();

const busy = ref(false);

const isAdmin = computed(() => {
  const u: any = auth.currentUser;
  if (!u) return false;

  const isAdminFlag =
      u.is_admin === true ||
      u.is_admin === 1 ||
      u.is_admin === "1" ||
      String(u.is_admin).toLowerCase() === "true";

  const roles = Array.isArray(u.roles) ? u.roles.map((r: any) => String(r).toLowerCase()) : [];
  return isAdminFlag || roles.includes("admin");
});

const displayName = computed(() => {
  if (!auth.currentUser) return t("userPanel.greeting.noName");
  return auth.currentUser.name ?? t("userPanel.greeting.noName");
});

const title = computed(() => (auth.isLoggedIn ? t("dashboard.title") : t("dashboard.welcomeTitle")));
const subtitle = computed(() =>
    auth.isLoggedIn ? t("dashboard.subtitle.loggedIn") : t("dashboard.subtitle.guest")
);

function meta(type: unknown) {
  return getTrainingTypeMeta(type as any);
}

const recentTrainings = computed(() => {
  const items = trainingStore.items ?? [];
  return [...items].sort((a: any, b: any) => (b.id ?? 0) - (a.id ?? 0)).slice(0, 6);
});

const totalTrainings = computed(() => (trainingStore.items?.length ?? 0).toString());


const globalTotals = computed(() => {
  const items: any[] = trainingStore.items ?? [];

  let totalDurationMin = 0;
  let totalDistanceM = 0;

  for (const tr of items) {
    totalDurationMin += Number(tr.durationMin ?? tr.duration ?? 0);
    totalDistanceM += Number(tr.distanceM ?? tr.distanceM ?? 0);
  }

  return { totalDurationMin, totalDistanceM };
});

function formatDuration(min: number) {
  const m = Math.max(0, Math.floor(min));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  if (h <= 0) return `${rest} min`;
  return `${h} h ${rest} min`;
}

function formatDistance(meters: number) {
  const m = Math.max(0, Math.floor(meters));
  if (m < 1000) return `${m} m`;
  const km = m / 1000;
  return `${km.toFixed(2)} km`;
}

const totalDuration = computed(() => formatDuration(globalTotals.value.totalDurationMin));
const totalDistance = computed(() => formatDistance(globalTotals.value.totalDistanceM));

const avgSpeedKmh = computed(() => {
  const dKm = globalTotals.value.totalDistanceM / 1000;
  const h = globalTotals.value.totalDurationMin / 60;
  if (dKm <= 0 || h <= 0) return 0;
  return dKm / h;
});

function paceMinPerKm(speedKmh: number) {
  if (speedKmh <= 0) return "--:--";
  const minPerKm = 60 / speedKmh;
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const avgPace = computed(() => paceMinPerKm(avgSpeedKmh.value));

const themeLabel = computed(() => (theme.value === "dark" ? "Ciemny" : "Jasny"));

async function refresh() {
  if (!auth.isLoggedIn) return;
  busy.value = true;
  try {
    await trainingStore.fetchList();
  } finally {
    busy.value = false;
  }
}

function goCreate() {
  trainingStore.setMode("create");
  trainingStore.selectById(null);
  router.push("/trainings");
}

async function openTraining(id: number) {
  trainingStore.setMode("details");
  trainingStore.selectById(id);
  await router.push("/trainings");
  await trainingStore.fetchDetails(id);
}

function goProfile() {
  router.push("/profile");
}

function toggleLocale() {
  setLocale(locale.value === "pl" ? "en" : "pl");
}

onMounted(async () => {
  if (auth.isLoggedIn && !trainingStore.items.length) {
    await refresh();
  }
});
</script>
