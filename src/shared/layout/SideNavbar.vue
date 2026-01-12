<template>
  <div>
    <aside
        class="fixed top-0 left-0 h-screen w-64 app-nav flex flex-col transition-transform duration-300"
        :class="ui.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="py-3 mb-4 border-b border-slate-200 dark:border-slate-700 flex justify-center">
        <BaseLogo />
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto py-2 px-2 space-y-2">
        <div class="px-2 text-xs opacity-60">
          {{ t("training.title") }}
        </div>

        <template v-if="auth.isLoggedIn">
          <!-- Create -->
          <button
              type="button"
              class="app-button w-full justify-center"
              @click="goCreate"
          >
            + {{ t("training.addNew") }}
          </button>

          <!-- Items -->
          <button
              v-for="tr in trainingStore.items"
              :key="tr.id"
              type="button"
              class="app-nav-item"
              :class="tr.id === trainingStore.selectedId ? 'app-nav-item-active' : 'app-nav-item-idle'"
              @click="openTraining(tr.id)"
          >
            <div class="font-medium truncate flex items-center gap-2">
              <span class="shrink-0">{{ trainingMeta(tr.type).emoji }}</span>
              <span class="truncate">{{ tr.name }}</span>
            </div>

            <div class="text-xs opacity-70 truncate">
              {{ t(trainingMeta(tr.type).i18nKey) }}
            </div>
          </button>

          <div v-if="trainingStore.isLoading" class="text-xs opacity-70 px-2">
            {{ t("common.loading") }}
          </div>

          <div
              v-if="trainingStore.error"
              class="app-card p-3 border border-red-500/30 bg-red-500/5 text-xs text-slate-900 dark:text-slate-100"
          >
            <span class="font-medium">{{ t("common.error") }}:</span>
            {{ trainingStore.error.message }}
          </div>
        </template>

        <div v-else class="px-2 text-xs opacity-60">
          {{ t("userPanel.login") }}
        </div>
      </div>

      <!-- Footer / user -->
      <div class="px-3 py-4">
        <div class="app-surface px-4 py-3 text-xs space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="truncate max-w-[150px]">{{ userName }}</span>

            <BaseDropdown>
              <template #trigger>
                <button class="app-button-secondary px-3 py-2 text-sm">⚙️</button>
              </template>

              <div class="space-y-2 text-xs">
                <div class="flex items-center justify-between gap-3">
                  <span>{{ t("settings.theme.title") }}</span>
                  <button @click="toggleTheme" class="app-button-secondary px-3 py-1 text-xs">
                    {{ theme === "dark" ? "🌙" : "☀️" }}
                  </button>
                </div>

                <div class="flex items-center justify-between gap-3">
                  <span>{{ t("settings.locale.title") }}</span>
                  <button
                      @click="setLocale(locale === 'pl' ? 'en' : 'pl')"
                      class="app-button-secondary px-3 py-1 text-xs"
                  >
                    {{ locale === "pl" ? "PL" : "EN" }}
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <RouterLink class="app-link" to="/profile">
                    {{ t("settings.profile.open") }}
                  </RouterLink>
                </div>

                <div v-if="canSeeAdmin" class="flex items-center justify-between">
                  <RouterLink class="app-link" to="/admin/users">
                    {{ t("admin.panel.open") }}
                  </RouterLink>
                </div>
              </div>
            </BaseDropdown>
          </div>

          <div class="pt-3 app-divider" v-if="auth.isLoggedIn">
            <button type="button" class="app-link" @click="onLogout">
              {{ t("userPanel.logout") }}
            </button>
          </div>

          <div class="pt-3 app-divider" v-else>
            <nav class="flex flex-col gap-1">
              <RouterLink class="app-link" to="/login">{{ t("userPanel.login") }}</RouterLink>
            </nav>
          </div>
        </div>
      </div>
    </aside>

    <!-- Toggle handle -->
    <button
        @click="ui.toggleSidebar()"
        class="fixed top-1/2 z-50 w-6 h-16 flex items-center justify-center rounded-r-full app-surface text-sm shadow transition-all duration-300"
        :class="ui.isSidebarOpen ? 'left-64' : 'left-0'"
    >
      {{ ui.isSidebarOpen ? "‹" : "›" }}
    </button>
  </div>
</template>


<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";

import BaseLogo from "../ui/BaseLogo.vue";
import BaseDropdown from "../ui/BaseDropdown.vue";

import { useTrainingStore } from "../../features/training/stores/trainingStore";
import { useTheme } from "../composables/useTheme";
import { useLocale } from "../composables/useLocale";
import { useI18n } from "../composables/useI18n";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { useUiStore } from "../stores/uiStore";

import { getTrainingTypeMeta } from "../../features/training/utils/trainingTypeMeta";
import {AdminService} from "../../features/admin/services/AdminService.ts";

const auth = useAuthStore();
const ui = useUiStore();
const trainingStore = useTrainingStore();

const router = useRouter();
const route = useRoute();

const { theme, toggleTheme } = useTheme();
const { locale, setLocale } = useLocale();
const { t } = useI18n();

const userName = computed(() =>
    auth.currentUser ? auth.currentUser.name : t("userPanel.greeting.noName")
);

const canSeeAdmin = ref(false);

async function refreshAdminAccess() {
  if (!auth.isLoggedIn) {
    canSeeAdmin.value = false;
    return;
  }

  try {
    canSeeAdmin.value = await AdminService.canAccessAdmin();
  } catch (e: any) {
    const status = e?.response?.status ?? e?.status ?? 0;

    if (status === 403 || status === 401 || status === 419) {
      canSeeAdmin.value = false;
      return;
    }

    console.error("Admin access check failed:", e);
    canSeeAdmin.value = false;
  }
}


onMounted(refreshAdminAccess);

watch(
    () => auth.isLoggedIn,
    () => refreshAdminAccess(),
    { immediate: true }
);


function trainingMeta(type: string) {
  return getTrainingTypeMeta(type);
}

async function ensureTrainingsLoaded() {
  if (!auth.isLoggedIn) return;
  if (trainingStore.items.length) return;
  await trainingStore.fetchList();
}

function goCreate() {
  trainingStore.setMode("create");
  trainingStore.selectById(null);
  router.push("/trainings");
}

async function openTraining(id: number) {
  trainingStore.setMode("details");
  trainingStore.selectById(id);

  if (route.path !== "/trainings") {
    await router.push("/trainings");
  }

  await trainingStore.fetchDetails(id);
}

async function onLogout() {
  await auth.logout();
  trainingStore.reset();
  await router.push("/login");
}

onMounted(ensureTrainingsLoaded);

watch(
    () => auth.isLoggedIn,
    async (loggedIn) => {
      if (!loggedIn) return;
      await ensureTrainingsLoaded();
    },
    { immediate: true }
);
</script>
