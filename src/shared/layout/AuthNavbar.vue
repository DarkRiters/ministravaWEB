<template>
  <header class="w-full app-nav px-6 py-3">
    <div class="flex items-center justify-between gap-4">
      <BaseLogo />

      <nav class="hidden md:flex items-center gap-4">
        <RouterLink class="app-link" to="/login">
          {{ t("auth.login.title") }}
        </RouterLink>

        <RouterLink class="app-link" to="/register">
          {{ t("auth.register.title") }}
        </RouterLink>

        <RouterLink class="app-link" to="/forgot-password">
          {{ t("auth.forgot.title") }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-2">
        <button
            @click="toggleTheme"
            class="app-button-secondary px-3 py-2 text-sm"
            type="button"
            aria-label="Toggle theme"
        >
          {{ theme === "dark" ? "🌙" : "☀️" }}
        </button>

        <button
            @click="setLocale(locale === 'pl' ? 'en' : 'pl')"
            class="app-button-secondary px-3 py-2 text-sm"
            type="button"
            aria-label="Toggle locale"
        >
          {{ locale === "pl" ? "PL" : "EN" }}
        </button>
      </div>
    </div>

    <!-- Mobile nav -->
    <nav class="mt-3 flex flex-wrap gap-3 md:hidden">
      <RouterLink class="app-link text-sm" to="/login">
        {{ t("auth.login.title") }}
      </RouterLink>

      <RouterLink class="app-link text-sm" to="/register">
        {{ t("auth.register.title") }}
      </RouterLink>

      <RouterLink class="app-link text-sm" to="/forgot-password">
        {{ t("auth.forgot.title") }}
      </RouterLink>
    </nav>
  </header>
</template>


<script setup lang="ts">

import {useTheme} from "../composables/useTheme.ts";
import {useLocale} from "../composables/useLocale.ts";
import {useI18n} from "../composables/useI18n.ts";
import BaseLogo from "../ui/BaseLogo.vue";

const {theme, toggleTheme} = useTheme();
const {locale, setLocale} = useLocale();
const {t} = useI18n();
</script>