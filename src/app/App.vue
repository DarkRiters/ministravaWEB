<template>
  <div class="min-h-screen app-shell">
    <SideNavbar v-if="!isAuthRoute" />

    <main :class="mainClass">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import SideNavbar from "../shared/layout/SideNavbar.vue";
import {useUiStore} from "../shared/stores/uiStore.ts";

const route = useRoute();
const ui = useUiStore();


const isAuthRoute = computed(() => Boolean(route.meta?.guestOnly));

const mainClass = computed(() => {
  if (isAuthRoute.value) return "min-h-screen";

  const base = "min-h-screen px-6 py-6 overflow-y-auto transition-all duration-300";
  return ui.isSidebarOpen ? `${base} ml-64` : `${base} ml-0`;
});
</script>
