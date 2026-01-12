<template>
  <AuthForm :title="t('auth.login.title')" :onSubmit="onSubmit">
    <BaseInput
        id="email"
        :label="t('auth.fields.email')"
        type="email"
        :placeholder="t('auth.placeholders.email')"
        autocomplete="email"
        name="email"
        v-model="email"
        :error="emailError ? t(emailError) : ''"
    />

    <BaseInput
        id="password"
        :label="t('auth.fields.password')"
        type="password"
        :placeholder="t('auth.placeholders.password')"
        autocomplete="current-password"
        name="password"
        v-model="password"
        :error="passwordError ? t(passwordError) : ''"
    />

    <template #actions>
      <BaseButton type="submit" class="app-button w-full">
        {{ t("auth.login.submit") }}
      </BaseButton>
    </template>

    <template #footer>
      <nav class="flex gap-4 justify-center">
        <RouterLink class="app-link" to="/register">
          {{ t("auth.login.noAccount") }}
        </RouterLink>
        <RouterLink class="app-link" to="/forgot-password">
          {{ t("auth.login.forgotPassword") }}
        </RouterLink>
      </nav>
    </template>
  </AuthForm>
</template>


<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

import BaseButton from "../../../shared/ui/BaseButton.vue";
import BaseInput from "../../../shared/ui/BaseInput.vue";
import AuthForm from "../ui/AuthForm.vue";

import { useI18n } from "../../../shared/composables/useI18n";
import type { MessageKey } from "../../../shared/i18n/messages";

import { validateEmail, validatePassword } from "../utils/validators";
import { useAuthStore } from "../stores/authStore";
import { router } from "../../../app/router";

const auth = useAuthStore();
const { t } = useI18n();

const email = ref("");
const password = ref("");

const emailError = ref<MessageKey | null>(null);
const passwordError = ref<MessageKey | null>(null);

async function onSubmit() {
  emailError.value = validateEmail(email.value) ?? null;
  passwordError.value = validatePassword(password.value) ?? null;

  if (emailError.value || passwordError.value) return;

  await auth.login(email.value, password.value);

  await router.push("/");
}
</script>
