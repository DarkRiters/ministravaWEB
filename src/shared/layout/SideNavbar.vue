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

      <!-- Content -->
      <div class="flex-1 overflow-y-auto py-2 px-2 space-y-3">
        <div class="px-2 text-xs opacity-60">
          {{ t("admin.panel.title") ?? "Panel administratora" }}
        </div>

        <template v-if="auth.isLoggedIn">
          <!-- Admin tiles -->
          <div class="grid grid-cols-1 gap-2 px-1">
            <RouterLink
                v-if="canSeeAdmin"
                to="/admin/stats"
                class="app-card p-3 text-left hover:opacity-90 transition"
                :class="isActive('/admin/stats') ? 'ring-2 ring-blue-500/60' : ''"
            >
              <div class="font-medium flex items-center gap-2">
                <span class="shrink-0">📊</span>
                <span>{{ t("admin.nav.dashboard") ?? "Statystyki" }}</span>
              </div>
              <div class="text-xs opacity-70 mt-1">
                {{ t("admin.nav.dashboardDesc") ?? "Globalne statystyki systemu" }}
              </div>
            </RouterLink>

            <RouterLink
                v-if="canSeeAdmin"
                to="/admin/users"
                class="app-card p-3 text-left hover:opacity-90 transition"
                :class="isActive('/admin/users') ? 'ring-2 ring-blue-500/60' : ''"
            >
              <div class="font-medium flex items-center gap-2">
                <span class="shrink-0">👤</span>
                <span>{{ t("admin.nav.users") ?? "Użytkownicy" }}</span>
              </div>
              <div class="text-xs opacity-70 mt-1">
                {{ t("admin.nav.usersDesc") ?? "Lista, edycja, usuwanie" }}
              </div>
            </RouterLink>

            <RouterLink
                v-if="canSeeAdmin"
                to="/admin/activities"
                class="app-card p-3 text-left hover:opacity-90 transition"
                :class="isActive('/admin/activities') ? 'ring-2 ring-blue-500/60' : ''"
            >
              <div class="font-medium flex items-center gap-2">
                <span class="shrink-0">🧭</span>
                <span>{{ t("admin.nav.activities") ?? "Aktywności" }}</span>
              </div>
              <div class="text-xs opacity-70 mt-1">
                {{ t("admin.nav.activitiesDesc") ?? "Filtry, wyszukiwanie, usuwanie" }}
              </div>
            </RouterLink>
          </div>

          <!-- If logged in but not admin -->
          <div v-if="!canSeeAdmin" class="app-card p-3 text-xs opacity-80">
            {{ t("admin.panel.noAccess") ?? "Brak dostępu do panelu administratora." }}
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
import { computed, onMounted, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

import BaseLogo from "../ui/BaseLogo.vue";
import BaseDropdown from "../ui/BaseDropdown.vue";

import { useTheme } from "../composables/useTheme";
import { useLocale } from "../composables/useLocale";
import { useI18n } from "../composables/useI18n";
import { useAuthStore } from "../../features/auth/stores/authStore";
import { useUiStore } from "../stores/uiStore";

import { AdminService } from "../../features/admin/services/AdminService";

const auth = useAuthStore();
const ui = useUiStore();

const router = useRouter();
const route = useRoute();

const { theme, toggleTheme } = useTheme();
const { locale, setLocale } = useLocale();
const { t } = useI18n();

const userName = computed(() =>
    auth.currentUser ? auth.currentUser.email : t("userPanel.greeting.noName")
);

const canSeeAdmin = ref(false);

// ---- anti-loop / anti-spam state
const isCheckingAdmin = ref(false);
let hasCheckedRemoteForUserKey: string | null = null;
let lastRemoteResult: boolean | null = null;

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + "/");
}

function localAdminHint(): boolean {
  const u: any = auth.currentUser;
  return u?.is_admin === true || (Array.isArray(u?.roles) && u.roles.includes("admin"));
}

function currentUserKey(): string | null {
  const u: any = auth.currentUser;
  if (!u?.id) return null;

  return String(u.id);
}

async function refreshAdminAccess({ forceRemote = false }: { forceRemote?: boolean } = {}) {
  if (!auth.isLoggedIn) {
    canSeeAdmin.value = false;
    isCheckingAdmin.value = false;
    hasCheckedRemoteForUserKey = null;
    lastRemoteResult = null;
    return;
  }

  if (localAdminHint()) {
    canSeeAdmin.value = true;
    lastRemoteResult = true;
    return;
  }

  const key = currentUserKey();
  if (!forceRemote && key && hasCheckedRemoteForUserKey === key && lastRemoteResult === false) {
    canSeeAdmin.value = false;
    return;
  }

  if (isCheckingAdmin.value) return;

  if (!key) {
    canSeeAdmin.value = false;
    return;
  }

  isCheckingAdmin.value = true;
  hasCheckedRemoteForUserKey = key;

  try {
    const ok = await AdminService.canAccessAdmin();
    canSeeAdmin.value = ok;
    lastRemoteResult = ok;
  } catch (e: any) {
    canSeeAdmin.value = false;
    lastRemoteResult = false;
  } finally {
    isCheckingAdmin.value = false;
  }
}

onMounted(() => {
  refreshAdminAccess({ forceRemote: true });
});

watch(
    () => auth.isLoggedIn,
    (loggedIn) => {
      if (!loggedIn) {
        canSeeAdmin.value = false;
        hasCheckedRemoteForUserKey = null;
        lastRemoteResult = null;
        return;
      }
      refreshAdminAccess({ forceRemote: true });
    }
);

watch(
    () => (auth.currentUser as any)?.id,
    () => {
      hasCheckedRemoteForUserKey = null;
      lastRemoteResult = null;
      refreshAdminAccess({ forceRemote: true });
    }
);

async function onLogout() {
  await auth.logout();
  await router.push("/login");
}
</script>
