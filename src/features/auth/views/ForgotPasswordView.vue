<template>
  <AuthForm :title="t('auth.forgot.title')" :onSubmit="onSubmit">
    <BaseInput
        id="email"
        :label="t('auth.forgot.subtitle')"
        type="email"
        :placeholder="t('auth.placeholders.email')"
        v-model="email"
        :error="emailError ? t(emailError) : ''"
    />

    <!-- NOTIFICATIONS -->
    <div
        v-if="notice.type === 'success'"
        class="app-card p-3 border border-green-500/30 bg-green-500/5 text-sm"
    >
      {{ t("auth.forgot.success") }}
    </div>

    <div
        v-else-if="notice.type === 'error'"
        class="app-card p-3 border border-red-500/30 bg-red-500/5 text-sm"
    >
      <div class="font-medium">{{ t("auth.forgot.error") }}</div>
      <div class="text-xs opacity-70 mt-1">
        {{ notice.message || t("auth.forgot.tryAgain") }}
      </div>
    </div>

    <template #actions>
      <BaseButton type="submit" class="app-button w-full" :disabled="busy">
        {{ busy ? t("auth.forgot.loading") : t("auth.forgot.submit") }}
      </BaseButton>
    </template>

    <template #footer>
      <nav class="flex gap-4 justify-center">
        <RouterLink class="app-link" to="/login">
          {{ t("auth.forgot.goToLogin") }}
        </RouterLink>
      </nav>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import AuthForm from "../ui/AuthForm.vue";
import { reactive, ref } from "vue";
import BaseInput from "../../../shared/ui/BaseInput.vue";
import BaseButton from "../../../shared/ui/BaseButton.vue";
import { useI18n } from "../../../shared/composables/useI18n";
import type { MessageKey } from "../../../shared/i18n/messages";
import { validateEmail } from "../utils/validators";
import { authStore } from "../stores/authStore";

const auth = authStore();
const { t } = useI18n();

const email = ref("");
const emailError = ref<MessageKey | null>(null);
const busy = ref(false);

const notice = reactive<{ type: "idle" | "success" | "error"; message?: string }>({
  type: "idle",
  message: "",
});

async function onSubmit() {
  notice.type = "idle";
  notice.message = "";

  emailError.value = validateEmail(email.value) ?? null;
  if (emailError.value) return;

  busy.value = true;
  try {
    await auth.requestPasswordReset(email.value);

    notice.type = "success";
  } catch (e: any) {
    notice.type = "error";
    notice.message = e?.message ?? "";
  } finally {
    busy.value = false;
  }
}
</script>
