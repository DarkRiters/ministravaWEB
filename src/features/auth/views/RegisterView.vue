<template>
  <AuthForm :title="t('auth.register.title')" :onSubmit="onSubmit">
    <BaseInput
        id="name"
        :label="tSafe('auth.fields.name', 'Nazwa')"
        type="text"
        :placeholder="tSafe('auth.placeholders.name', 'Twoja nazwa')"
        v-model="name"
        :error="nameError ? t(nameError) : ''"
    />

    <BaseInput
        id="email"
        :label="t('auth.fields.email')"
        type="email"
        :placeholder="t('auth.placeholders.email')"
        v-model="email"
        :error="emailError ? t(emailError) : ''"
    />

    <BaseInput
        id="password"
        :label="t('auth.fields.password')"
        type="password"
        :placeholder="t('auth.placeholders.password')"
        v-model="password"
        :error="passwordError ? t(passwordError) : confirmPasswordError ? t(confirmPasswordError) : ''"
    />

    <BaseInput
        id="confirmpassword"
        :label="t('auth.fields.confirmPassword')"
        type="password"
        :placeholder="t('auth.placeholders.password')"
        v-model="confirmPassword"
        :error="passwordError ? t(passwordError) : confirmPasswordError ? t(confirmPasswordError) : ''"
    />

    <template #actions>
      <BaseButton type="submit" class="app-button w-full">
        {{ t("auth.register.submit") }}
      </BaseButton>
    </template>

    <template #footer>
      <div class="space-y-2">
        <div
            v-if="successMessage"
            class="app-card p-3 border border-green-500/30 bg-green-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          {{ successMessage }}
        </div>

        <nav class="flex gap-4 justify-center">
          <RouterLink class="app-link" to="/login">
            {{ t("auth.register.haveAccount") }}
          </RouterLink>
        </nav>
      </div>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

import AuthForm from "../ui/AuthForm.vue";
import { authStore } from "../stores/authStore";

import BaseInput from "../../../shared/ui/BaseInput.vue";
import BaseButton from "../../../shared/ui/BaseButton.vue";
import { useI18n } from "../../../shared/composables/useI18n";

import { validateEmail, validatePassword, validatePasswordConfirm } from "../utils/validators";
import type { MessageKey } from "../../../shared/i18n/messages";
import { router } from "../../../app/router";

const auth = authStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const { t } = useI18n();

const successMessage = ref("");

const nameError = ref<MessageKey | null>(null);
const emailError = ref<MessageKey | null>(null);
const passwordError = ref<MessageKey | null>(null);
const confirmPasswordError = ref<MessageKey | null>(null);

function tSafe(key: any, fallback: string): string {
  try {
    const out = t(key);
    return out || fallback;
  } catch {
    return fallback;
  }
}

function validateName(value: string): MessageKey | null {
  if (!value.trim()) return "auth.errors.nameRequired" as MessageKey;
  return null;
}

async function onSubmit() {
  successMessage.value = "";

  nameError.value = validateName(name.value);
  emailError.value = validateEmail(email.value) ?? null;
  passwordError.value = validatePassword(password.value) ?? null;
  confirmPasswordError.value = validatePasswordConfirm(password.value, confirmPassword.value) ?? null;

  if (nameError.value || emailError.value || passwordError.value || confirmPasswordError.value) return;

  const res = await auth.register(name.value, email.value, password.value);

  successMessage.value =
      res.message || "Konto utworzone. Sprawdź email i kliknij link weryfikacyjny.";

  setTimeout(() => {
    router.push({ name: "login" });
  }, 2000);
}
</script>
