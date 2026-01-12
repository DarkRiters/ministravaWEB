<template>
  <AuthNavbar />

  <div class="app-shell min-h-screen flex items-center justify-center px-6 py-8">
    <div class="w-full max-w-md app-surface p-6 space-y-4">
      <h1 class="text-center text-lg font-semibold">
        {{ title }}
      </h1>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <slot />

        <div>
          <slot name="actions" />
        </div>

        <div class="pt-3 app-divider text-center">
          <slot name="footer" />
        </div>
      </form>
    </div>
  </div>
</template>


<script setup lang="ts">
import AuthNavbar from "../../../shared/layout/AuthNavbar.vue";

defineProps<{
  title: string;
  onSubmit: () => void | Promise<void>;
}>()
</script>
