<template>
  <div class="app-page app-shell">
    <div class="max-w-lg mx-auto p-6">
      <div class="app-surface p-6 space-y-4">
        <h1 class="text-lg font-semibold">{{ t("auth.verify.title") }}</h1>

        <div v-if="status === 'loading'" class="text-sm opacity-70">
          {{ t("auth.verify.loading") }}
        </div>

        <div
            v-else-if="status === 'success'"
            class="app-card p-4 border border-emerald-500/30 bg-emerald-500/5 text-sm"
        >
          <div class="font-medium">{{ t("auth.verify.success.title") }}</div>
          <div class="opacity-80 mt-1">{{ t("auth.verify.success.subtitle") }}</div>
        </div>

        <div
            v-else-if="status === 'expired'"
            class="app-card p-4 border border-amber-500/30 bg-amber-500/5 text-sm"
        >
          <div class="font-medium">{{ t("auth.verify.expired.title") }}</div>
          <div class="opacity-80 mt-1">{{ t("auth.verify.expired.subtitle") }}</div>
        </div>

        <div v-else class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm">
          <div class="font-medium">{{ t("auth.verify.error.title") }}</div>
          <div class="opacity-80 mt-1">{{ errorMsg }}</div>
        </div>

        <div class="pt-2 flex gap-2">
          <RouterLink class="app-button w-full text-center" to="/login">
            {{ t("auth.verify.actions.goLogin") }}
          </RouterLink>

          <button
              class="app-button-secondary w-full"
              type="button"
              @click="retry"
              :disabled="status === 'loading'"
          >
            {{ t("auth.verify.actions.retry") }}
          </button>
        </div>

        <div class="text-xs opacity-60">
          {{ t("auth.verify.hint") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, RouterLink } from "vue-router";
import { api } from "../../../shared/services/http/api";
import { useI18n } from "../../../shared/composables/useI18n";

type Status = "loading" | "success" | "error" | "expired";

const { t } = useI18n();
const route = useRoute();

const status = ref<Status>("loading");
const errorMsg = ref<string>("");

const id = computed(() => String(route.query.id ?? ""));
const hash = computed(() => String(route.query.hash ?? ""));
const expires = computed(() => String(route.query.expires ?? ""));
const signature = computed(() => String(route.query.signature ?? ""));

function buildVerifyUrl(): string {
  const qs = new URLSearchParams();
  if (expires.value) qs.set("expires", expires.value);
  if (signature.value) qs.set("signature", signature.value);

  //
  return `/email/verify/${encodeURIComponent(id.value)}/${encodeURIComponent(hash.value)}?${qs.toString()}`;
}

async function verify() {
  status.value = "loading";
  errorMsg.value = "";

  if (!id.value || !hash.value || !expires.value || !signature.value) {
    status.value = "error";
    errorMsg.value = t("auth.verify.error.missingParams");
    return;
  }

  try {
    await api.get(buildVerifyUrl(), { headers: { Accept: "application/json" } });
    status.value = "success";
  } catch (e: any) {
    const code = e?.response?.status ?? 0;
    const msg = e?.response?.data?.message ?? e?.message ?? "Verification error.";

    if (code === 403) {
      status.value = "expired";
      errorMsg.value = msg;
      return;
    }

    status.value = "error";
    errorMsg.value = msg;
  }
}

function retry() {
  verify();
}

onMounted(() => {
  verify();
});
</script>
