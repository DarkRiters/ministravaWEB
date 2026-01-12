<template>
  <div class="app-page app-shell">
    <div class="max-w-lg mx-auto space-y-6">
      <div class="app-surface p-6 space-y-5">
        <div class="space-y-1">
          <h1 class="text-lg font-semibold">{{ t("auth.reset.title") }}</h1>
          <p class="text-sm opacity-70">
            {{ t("auth.reset.subtitle") }}
          </p>
        </div>

        <div v-if="error" class="app-card p-4 text-sm border border-slate-200 dark:border-slate-700">
          <div class="font-medium">{{ t("common.error") }}</div>
          <div class="mt-1 opacity-80">{{ error }}</div>
        </div>

        <div v-if="success" class="app-card p-4 text-sm border border-slate-200 dark:border-slate-700">
          <div class="font-medium">{{ t("common.save") }}</div>
          <div class="mt-1 opacity-80">{{ success }}</div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="text-xs opacity-70">{{ t("auth.fields.email") }}</label>
            <input
                v-model="email"
                class="mt-1 app-input"
                type="email"
                autocomplete="email"
                :readonly="!!route.query.email"
            />
            <div v-if="emailError" class="text-xs mt-1 opacity-70">
              {{ t(emailError) }}
            </div>
          </div>

          <div>
            <label class="text-xs opacity-70">{{ t("auth.fields.password") }}</label>
            <input
                v-model="password"
                class="mt-1 app-input"
                type="password"
                autocomplete="new-password"
            />
            <div v-if="passwordError" class="text-xs mt-1 opacity-70">
              {{ t(passwordError) }}
            </div>
          </div>

          <div>
            <label class="text-xs opacity-70">{{ t("auth.fields.confirmPassword") }}</label>
            <input
                v-model="passwordConfirm"
                class="mt-1 app-input"
                type="password"
                autocomplete="new-password"
            />
            <div v-if="confirmError" class="text-xs mt-1 opacity-70">
              {{ t(confirmError) }}
            </div>
          </div>

          <div v-if="!token" class="text-xs opacity-70">
            {{ t("auth.reset.missingToken") }}
          </div>

          <button
              class="app-button w-full"
              :disabled="isBusy || !canSubmit"
              @click="onSubmit"
          >
            {{ isBusy ? t("common.loading") : t("auth.reset.submit") }}
          </button>

          <div class="pt-1 text-xs opacity-70">
            <RouterLink class="app-link" to="/login">
              {{ t("auth.reset.backToLogin") }}
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";

import { useI18n } from "../../../shared/composables/useI18n";
import type { MessageKey } from "../../../shared/i18n/messages";

import { validateEmail, validatePassword, validatePasswordConfirm } from "../../auth/utils/validators";
import {api} from "../../../shared/services/http/api.ts";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const isBusy = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const token = computed(() => String(route.query.token ?? "").trim());
const email = ref(String(route.query.email ?? "").trim());

const password = ref("");
const passwordConfirm = ref("");

const emailError = ref<MessageKey | null>(null);
const passwordError = ref<MessageKey | null>(null);
const confirmError = ref<MessageKey | null>(null);

const canSubmit = computed(() => {
  return (
      token.value.length > 0 &&
      email.value.trim().length > 0 &&
      password.value.trim().length > 0 &&
      passwordConfirm.value.trim().length > 0
  );
});

async function onSubmit() {
  error.value = null;
  success.value = null;

  emailError.value = validateEmail(email.value) ?? null;
  passwordError.value = validatePassword(password.value) ?? null;
  confirmError.value = validatePasswordConfirm(password.value, passwordConfirm.value) ?? null;

  if (emailError.value || passwordError.value || confirmError.value) return;

  if (!token.value) {
    error.value = t("auth.reset.missingToken");
    return;
  }

  try {
    isBusy.value = true;

    await api.post("/reset-password", {
      token: token.value,
      email: email.value.trim(),
      password: password.value,
      password_confirmation: passwordConfirm.value,
    });

    success.value = t("auth.reset.success");

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  } catch (e: any) {
    const msg =
        e?.response?.data?.message ||
        e?.message ||
        t("auth.reset.error");
    error.value = msg;
  } finally {
    isBusy.value = false;
  }
}
</script>
