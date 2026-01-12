<template>
  <div class="app-page app-shell">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- PROFILE -->
      <div class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h1 class="text-lg font-semibold">{{ t("settings.profile.title") }}</h1>

          <button
              class="app-button-secondary px-3 py-2 text-sm"
              :disabled="isBusy"
              @click="refresh"
          >
            {{ t("common.refresh") }}
          </button>
        </div>

        <div
            v-if="profileError"
            class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          <span class="font-medium">{{ t("common.error") }}:</span>
          {{ profileError }}
        </div>

        <div
            v-if="profileSuccess"
            class="app-card p-4 border border-green-500/30 bg-green-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          {{ profileSuccess }}
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-xs opacity-70">{{ t("auth.fields.name") }}</label>
            <input v-model="profileForm.name" class="mt-1 app-input" type="text" />
          </div>

          <div>
            <label class="text-xs opacity-70">{{ t("auth.fields.email") }}</label>
            <input v-model="profileForm.email" class="mt-1 app-input" type="email" />
          </div>

          <button
              class="app-button w-full"
              :disabled="!canSaveProfile || isBusy"
              @click="saveProfile"
          >
            {{ isBusy ? t("common.loading") : t("settings.profile.save") }}
          </button>

          <div v-if="!hasChanges" class="text-xs opacity-60">
            {{ t("settings.profile.noChanges") }}
          </div>

          <button
              v-if="auth.isAdmin"
              class="app-button-secondary w-full"
              type="button"
              @click="openAdminPanel"
          >
            {{ t("admin.panel.open") }}
          </button>
        </div>
      </div>

      <!-- PASSWORD -->
      <div class="app-surface p-6 space-y-4">
        <h2 class="text-lg font-semibold">{{ t("settings.password.title") }}</h2>

        <div
            v-if="passwordError"
            class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          <span class="font-medium">{{ t("common.error") }}:</span>
          {{ passwordError }}
        </div>

        <div
            v-if="passwordSuccess"
            class="app-card p-4 border border-green-500/30 bg-green-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          {{ passwordSuccess }}
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-xs opacity-70">{{ t("settings.password.current") }}</label>
            <input
                v-model="passwordForm.currentPassword"
                class="mt-1 app-input"
                type="password"
                autocomplete="current-password"
            />
          </div>

          <div>
            <label class="text-xs opacity-70">{{ t("settings.password.new") }}</label>
            <input
                v-model="passwordForm.newPassword"
                class="mt-1 app-input"
                type="password"
                autocomplete="new-password"
            />
          </div>

          <div>
            <label class="text-xs opacity-70">{{ t("settings.password.confirm") }}</label>
            <input
                v-model="passwordForm.newPasswordConfirm"
                class="mt-1 app-input"
                type="password"
                autocomplete="new-password"
            />
          </div>

          <button
              class="app-button-secondary w-full"
              :disabled="!canChangePassword || isBusy"
              @click="changePassword"
          >
            {{ isBusy ? t("common.loading") : t("settings.password.submit") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "../../../shared/composables/useI18n";
import { useAuthStore } from "../../auth/stores/authStore";
import {
  validateEmail,
  validateRequired,
  validatePasswordConfirm,
  validateCurrentPassword,
  validateNewPassword,
} from "../../auth/utils/validators";

const { t } = useI18n();
const auth = useAuthStore();

const isBusy = ref(false);

const profileError = ref<string | null>(null);
const profileSuccess = ref<string | null>(null);

const passwordError = ref<string | null>(null);
const passwordSuccess = ref<string | null>(null);

const profileForm = reactive({
  name: "",
  email: "",
});

const baseline = reactive({
  name: "",
  email: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});

function hydrateProfile() {
  const name = auth.currentUser?.name ?? "";
  const email = auth.currentUser?.email ?? "";

  profileForm.name = name;
  profileForm.email = email;

  baseline.name = name;
  baseline.email = email;
}

async function refresh() {
  profileError.value = null;
  profileSuccess.value = null;

  try {
    isBusy.value = true;
    await auth.refreshMe();
    hydrateProfile();
    profileSuccess.value = t("settings.profile.refreshSuccess");
  } catch (e: any) {
    profileError.value = e?.message ?? t("settings.profile.refreshError");
  } finally {
    isBusy.value = false;
  }
}

const nameNow = computed(() => profileForm.name.trim());
const emailNow = computed(() => profileForm.email.trim().toLowerCase());
const nameBase = computed(() => baseline.name.trim());
const emailBase = computed(() => baseline.email.trim().toLowerCase());

const nameChanged = computed(() => nameNow.value !== nameBase.value);
const emailChanged = computed(() => emailNow.value !== emailBase.value);
const hasChanges = computed(() => nameChanged.value || emailChanged.value);

const canSaveProfile = computed(() => {
  return nameNow.value.length > 0 && emailNow.value.length > 0 && hasChanges.value;
});

function pickBackendMessage(e: any): string | null {
  const msg = e?.response?.data?.message;
  const errors = e?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstKey = Object.keys(errors)[0];
    const firstArr = firstKey ? errors[firstKey] : null;
    const first = Array.isArray(firstArr) ? firstArr[0] : null;
    if (typeof first === "string" && first.length) return first;
  }

  if (typeof msg === "string" && msg.length) return msg;
  if (typeof e?.message === "string" && e.message.length) return e.message;

  return null;
}

async function saveProfile() {
  profileError.value = null;
  profileSuccess.value = null;

  const nameErr = validateRequired(profileForm.name, "auth.errors.email.required");
  const emailErr = validateEmail(profileForm.email);

  if (nameErr) {
    profileError.value = t("settings.profile.nameRequired");
    return;
  }
  if (emailErr) {
    profileError.value = t(emailErr);
    return;
  }

  if (!hasChanges.value) {
    profileError.value = t("settings.profile.noChanges");
    return;
  }

  const payload: { name?: string; email?: string } = {};
  if (nameChanged.value) payload.name = nameNow.value;
  if (emailChanged.value) payload.email = emailNow.value;

  try {
    isBusy.value = true;
    await auth.updateProfile(payload);

    baseline.name = profileForm.name.trim();
    baseline.email = profileForm.email.trim();

    profileSuccess.value = t("settings.profile.saveSuccess");
  } catch (e: any) {
    profileError.value = pickBackendMessage(e) ?? t("settings.profile.saveError");
  } finally {
    isBusy.value = false;
  }
}

const canChangePassword = computed(() => {
  return (
      passwordForm.currentPassword.trim().length > 0 &&
      passwordForm.newPassword.trim().length > 0 &&
      passwordForm.newPasswordConfirm.trim().length > 0
  );
});

async function changePassword() {
  passwordError.value = null;
  passwordSuccess.value = null;

  const currErr = validateCurrentPassword(passwordForm.currentPassword);
  const newErr = validateNewPassword(passwordForm.newPassword);
  const confErr = validatePasswordConfirm(passwordForm.newPassword, passwordForm.newPasswordConfirm);

  if (currErr) {
    passwordError.value = t(currErr);
    return;
  }
  if (newErr) {
    passwordError.value = t(newErr);
    return;
  }
  if (confErr) {
    passwordError.value = t(confErr);
    return;
  }

  try {
    isBusy.value = true;
    await auth.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      newPasswordConfirm: passwordForm.newPasswordConfirm,
    });

    passwordSuccess.value = t("settings.password.success");
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.newPasswordConfirm = "";
  } catch (e: any) {
    passwordError.value = pickBackendMessage(e) ?? t("settings.password.error");
  } finally {
    isBusy.value = false;
  }
}

function openAdminPanel() {
  console.log("Admin panel open");
}

onMounted(() => {
  hydrateProfile();
});

watch(
    () => auth.currentUser,
    () => hydrateProfile(),
    { deep: true }
);
</script>
