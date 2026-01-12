<template>
  <div class="relative inline-block">
    <button @click="isOpen = !isOpen">
      <slot name="trigger" />
    </button>

    <div
        v-if="isOpen"
        class="absolute bottom-full right-0 mb-2 p-2 rounded-xl app-surface shadow-lg
             max-h-64 overflow-y-auto text-xs"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isOpen = ref(false);
</script>

<style scoped>
</style>
