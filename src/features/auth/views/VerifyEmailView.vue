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

        <div
            v-else-if="status === 'throttled'"
            class="app-card p-4 border border-amber-500/30 bg-amber-500/5 text-sm"
        >
          <div class="font-medium">{{ t("auth.verify.throttled.title") }}</div>
          <div class="opacity-80 mt-1">{{ t("auth.verify.throttled.subtitle") }}</div>
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
import { useI18n } from "../../../shared/composables/useI18n";

type Status = "loading" | "success" | "error" | "expired" | "throttled";

const { t } = useI18n();
const route = useRoute();

const status = ref<Status>("loading");
const errorMsg = ref<string>("");

const token = computed(() => String(route.query.token ?? ""));

function decodeToken(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function looksLikeAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

async function verify() {
  status.value = "loading";
  errorMsg.value = "";

  if (!token.value) {
    status.value = "error";
    errorMsg.value = t("auth.verify.error.missingParams");
    return;
  }

  const signedUrl = decodeToken(token.value);

  if (!looksLikeAbsoluteUrl(signedUrl)) {
    status.value = "error";
    errorMsg.value = t("auth.verify.error.invalidLink");
    return;
  }

  try {
    const res = await fetch(signedUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      status.value = "success";
      return;
    }

    if (res.status === 429) {
      status.value = "throttled";
      return;
    }

    if (res.status === 403) {
      status.value = "expired";
      try {
        const data = await res.json();
        errorMsg.value = String(data?.message ?? "");
      } catch {
      }
      return;
    }

    status.value = "error";
    try {
      const data = await res.json();
      errorMsg.value = String(data?.message ?? "Verification error.");
    } catch {
      errorMsg.value = "Verification error.";
    }
  } catch (e: any) {
    status.value = "error";
    errorMsg.value = e?.message ?? "Verification error.";
  }
}

function retry() {
  verify();
}

onMounted(() => {
  verify();
});
</script>
