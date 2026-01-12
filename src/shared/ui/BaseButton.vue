<template>
  <button
  :type="type ?? 'button'"
  class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500">
    <slot/>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit'
}>()
</script>
