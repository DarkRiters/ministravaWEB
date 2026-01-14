<template>
  <div class="app-page">
    <div class="app-container">
      <div class="app-surface p-5 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-xl font-semibold">{{ t("admin.activities.title") }}</div>
            <div class="text-xs opacity-70">
              {{ t("admin.activities.subtitle") }}
            </div>
          </div>

          <button class="app-button-secondary" type="button" @click="s.fetchAll()" :disabled="isLoading">
            {{ t("common.actions.refresh") }}
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div class="md:col-span-2">
            <input
                class="app-input"
                :placeholder="t('admin.activities.filters.searchPlaceholder')"
                :value="filters.q"
                @input="onQ"
            />
          </div>

          <div>
            <select class="app-input" :value="filters.userId ?? ''" @change="onUser">
              <option value="">{{ t("admin.activities.filters.userAll") }}</option>
              <option v-for="u in uniqueUsers" :key="u.id" :value="u.id">
                {{ u.label }}
              </option>
            </select>
          </div>

          <div>
            <select class="app-input" :value="filters.type ?? ''" @change="onType">
              <option value="">{{ t("admin.activities.filters.typeAll") }}</option>
              <option v-for="t1 in uniqueTypes" :key="t1" :value="t1">{{ t1 }}</option>
            </select>
          </div>

          <div>
            <input
                class="app-input"
                type="date"
                :value="filters.dateFrom ?? ''"
                @change="onDateFrom"
                :aria-label="t('admin.activities.filters.dateFrom')"
            />
          </div>

          <div>
            <input
                class="app-input"
                type="date"
                :value="filters.dateTo ?? ''"
                @change="onDateTo"
                :aria-label="t('admin.activities.filters.dateTo')"
            />
          </div>

          <div>
            <input
                class="app-input"
                type="number"
                min="0"
                :placeholder="t('admin.activities.filters.distanceMin')"
                :value="filters.distanceMin ?? ''"
                @input="onDistMin"
            />
          </div>

          <div>
            <input
                class="app-input"
                type="number"
                min="0"
                :placeholder="t('admin.activities.filters.distanceMax')"
                :value="filters.distanceMax ?? ''"
                @input="onDistMax"
            />
          </div>

          <div>
            <input
                class="app-input"
                type="number"
                min="0"
                :placeholder="t('admin.activities.filters.timeMin')"
                :value="filters.timeMin ?? ''"
                @input="onTimeMin"
            />
          </div>

          <div>
            <input
                class="app-input"
                type="number"
                min="0"
                :placeholder="t('admin.activities.filters.timeMax')"
                :value="filters.timeMax ?? ''"
                @input="onTimeMax"
            />
          </div>

          <div class="md:col-span-6 flex items-center justify-between">
            <div class="text-xs opacity-70">
              {{ t("admin.activities.loaded", { loaded: items.length }) }}
              ·
              {{ t("admin.activities.filtered", { filtered: filtered.length }) }}
            </div>

            <button class="app-button-secondary" type="button" @click="s.resetFilters()">
              {{ t("common.actions.resetFilters") }}
            </button>
          </div>
        </div>
      </div>

      <div class="app-surface p-5">
        <div v-if="error" class="app-card p-3 text-sm text-red-500">{{ error }}</div>
        <div v-if="isLoading" class="text-sm opacity-70">{{ t("common.states.loading") }}</div>

        <div v-if="!isLoading && filtered.length === 0" class="text-sm opacity-70">
          {{ t("common.states.noResults") }}
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="text-left opacity-70">
            <tr>
              <th class="py-2 pr-3">{{ t("admin.activities.table.id") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.user") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.name") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.note") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.type") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.distance") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.time") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.date") }}</th>
              <th class="py-2 pr-3">{{ t("admin.activities.table.actions") }}</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="a in filtered"
                :key="a.id"
                class="border-t border-slate-200 dark:border-slate-700"
            >
              <td class="py-2 pr-3">{{ a.id }}</td>

              <td class="py-2 pr-3">
                <div class="text-xs opacity-80">{{ a.user?.email ?? `User #${a.user_id}` }}</div>
                <div class="text-xs opacity-60">
                  {{ (a.user?.first_name ?? "") + " " + (a.user?.last_name ?? "") }}
                </div>
              </td>

              <td class="py-2 pr-3">{{ a.name }}</td>
              <td class="py-2 pr-3">{{ a.note }}</td>
              <td class="py-2 pr-3">{{ a.type }}</td>
              <td class="py-2 pr-3">{{ a.distance ?? 0 }}</td>
              <td class="py-2 pr-3">{{ a.time ?? 0 }}</td>
              <td class="py-2 pr-3">{{ a.created_at?.slice(0, 10) }}</td>

              <td class="py-2 pr-3">
                <button class="app-button-danger px-3 py-1 text-xs" type="button" @click="onRemove(a.id)">
                  {{ t("common.actions.delete") }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useAdminActivitiesStore } from "../stores/adminActivitiesStore";
import { useI18n } from "../../../shared/composables/useI18n";

const { t } = useI18n();

const s = useAdminActivitiesStore();
const { filters, uniqueUsers, uniqueTypes, filtered, items, isLoading, error } = storeToRefs(s);

onMounted(() => {
  s.fetchAll();
});

function onQ(e: Event) {
  s.setFilters({ q: (e.target as HTMLInputElement).value });
}
function onUser(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  s.setFilters({ userId: v ? Number(v) : null });
}
function onType(e: Event) {
  const v = (e.target as HTMLSelectElement).value;
  s.setFilters({ type: v ? v : null });
}
function onDateFrom(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ dateFrom: v || null });
}
function onDateTo(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ dateTo: v || null });
}
function onDistMin(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ distanceMin: v ? Number(v) : null });
}
function onDistMax(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ distanceMax: v ? Number(v) : null });
}
function onTimeMin(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ timeMin: v ? Number(v) : null });
}
function onTimeMax(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  s.setFilters({ timeMax: v ? Number(v) : null });
}

async function onRemove(id: number) {
  if (!confirm(t("common.confirm.deleteActivity"))) return;

  try {
    await s.remove(id);
  } catch (e: any) {
    alert(e?.response?.data?.message ?? e?.message ?? t("admin.activities.errors.delete"));
  }
}
</script>
