<template>
  <div class="app-page app-shell">
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- TOP: DETAILS PANEL -->
      <div class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h1 class="text-lg font-semibold">{{ t("training.details") }}</h1>

          <button
              class="app-button-secondary px-3 py-2 text-sm"
              :disabled="store.isLoading"
              @click="store.fetchList()"
          >
            {{ t("common.refresh") }}
          </button>
        </div>

        <div v-if="store.isLoading" class="text-sm opacity-70">
          {{ t("common.loading") }}
        </div>

        <div
            v-else-if="store.error"
            class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          <span class="font-medium">{{ t("common.error") }}:</span>
          {{ store.error.message }}
        </div>

        <!-- CREATE MODE -->
        <div v-else-if="store.mode === 'create'" class="space-y-4">
          <div class="text-sm opacity-70">
            {{ t("training.addNew") }}
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.name") }}</label>
              <input
                  v-model="form.name"
                  class="mt-1 app-input"
                  type="text"
                  :placeholder="t('training.fields.name')"
              />
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.type") }}</label>
              <select v-model="form.type" class="mt-1 app-input">
                <option v-for="tt in TRAINING_TYPES" :key="tt.value" :value="tt.value">
                  {{ tt.emoji }} {{ t(tt.i18nKey) }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("training.units.meters") }}</label>
                <input
                    v-model="form.distanceM"
                    class="mt-1 app-input"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="100000000"
                    step="1"
                />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("training.units.minutes") }}</label>
                <input
                    v-model="form.durationMin"
                    class="mt-1 app-input"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="100000"
                    step="1"
                />
              </div>
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.note") }}</label>
              <textarea
                  v-model="form.note"
                  class="mt-1 app-input min-h-[96px]"
                  :placeholder="t('training.fields.note')"
              />
            </div>

            <button
                class="app-button w-full"
                :disabled="!canSave || store.isMutating"
                @click="createTraining"
            >
              {{ store.isMutating ? t("common.loading") : t("common.create") }}
            </button>

            <div class="text-xs opacity-60">
              {{ t("training.create.hint") }}
            </div>
          </div>
        </div>

        <!-- NO SELECTION -->
        <div v-else-if="!store.selected" class="text-sm opacity-70">
          {{ t("training.selectHint") }}
        </div>

        <!-- DETAILS MODE -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2 text-sm opacity-80">
              <span class="app-badge">
                {{ getTrainingTypeMeta(form.type).emoji }}
                {{ t(getTrainingTypeMeta(form.type).i18nKey) }}
              </span>
            </div>

            <button class="app-button-secondary px-3 py-2 text-sm" type="button" @click="switchToCreate">
              + {{ t("training.addNew") }}
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.name") }}</label>
              <input v-model="form.name" class="mt-1 app-input" type="text" />
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.type") }}</label>
              <select v-model="form.type" class="mt-1 app-input">
                <option v-for="tt in TRAINING_TYPES" :key="tt.value" :value="tt.value">
                  {{ tt.emoji }} {{ t(tt.i18nKey) }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("training.units.meters") }}</label>
                <input
                    v-model="form.distanceM"
                    class="mt-1 app-input"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="100000000"
                    step="1"
                />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("training.units.minutes") }}</label>
                <input
                    v-model="form.durationMin"
                    class="mt-1 app-input"
                    type="number"
                    inputmode="numeric"
                    min="0"
                    max="100000"
                    step="1"
                />
              </div>
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("training.fields.note") }}</label>
              <textarea v-model="form.note" class="mt-1 app-input min-h-[96px]" />
            </div>

            <div class="flex flex-col md:flex-row gap-2 pt-2">
              <button
                  class="app-button-secondary flex-1"
                  :disabled="!canSave || !hasChanges || store.isMutating"
                  @click="saveTraining"
              >
                {{ store.isMutating ? t("common.loading") : t("common.save") }}
              </button>

              <button class="app-button-danger flex-1" :disabled="store.isMutating" @click="removeTraining">
                {{ t("training.actions.delete") }}
              </button>
            </div>

            <div v-if="!hasChanges" class="text-xs opacity-60">
              {{ t("settings.profile.noChanges") }}
            </div>
          </div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div v-if="store.mode !== 'create' && store.selected" class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">{{ t("training.details.summary.title") }}</h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div class="app-card p-3">
            <div class="text-xs opacity-70">{{ t("training.details.summary.totalDuration") }}</div>
            <div class="font-semibold">{{ durationMin }} {{ t("training.units.minutes") }}</div>
          </div>

          <div class="app-card p-3">
            <div class="text-xs opacity-70">{{ t("training.details.summary.totalDistance") }}</div>
            <div class="font-semibold">{{ distanceM }} {{ t("training.units.meters") }}</div>
            <div class="text-xs opacity-60 mt-1">({{ (distanceM / 1000).toFixed(2) }} km)</div>
          </div>

          <div class="app-card p-3">
            <div class="text-xs opacity-70">{{ t("training.details.summary.avgSpeed") }}</div>
            <div class="font-semibold">{{ avgSpeedKmh.toFixed(1) }} km/h</div>
            <div class="text-xs opacity-60 mt-1">
              {{ t("training.details.summary.avgPace") }}: {{ avgPace }} min/km
            </div>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from "vue";
import { useTrainingStore } from "../stores/trainingStore";
import { useI18n } from "../../../shared/composables/useI18n";
import { TRAINING_TYPES, type TrainingType, getTrainingTypeMeta } from "../domain/TrainingType";

const store = useTrainingStore();
const { t } = useI18n();

const defaultType: TrainingType = TRAINING_TYPES[0]?.value ?? "other";

const form = reactive({
  name: "",
  type: defaultType as TrainingType,
  distanceM: "" as string,
  durationMin: "" as string,
  note: "" as string,
});

function safeInt(v: string): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

const canSave = computed(() => form.name.trim().length > 0);
const durationMin = computed(() => safeInt(form.durationMin));
const distanceM = computed(() => safeInt(form.distanceM));

function hydrateFromSelected() {
  const tr = store.selected;
  if (!tr) return;

  form.name = tr.name ?? "";
  form.type = tr.type ?? defaultType;
  form.durationMin = String(tr.durationMin ?? 0);
  form.distanceM = String(tr.distanceM ?? 0);
  form.note = tr.note ?? "";
}

function resetForCreate() {
  form.name = "";
  form.type = defaultType;
  form.distanceM = "";
  form.durationMin = "";
  form.note = "";
}

const hasChanges = computed(() => {
  const tr = store.selected;
  if (!tr) return false;

  const nameChanged = form.name.trim() !== (tr.name ?? "");
  const typeChanged = String(form.type) !== String(tr.type);
  const durationChanged = durationMin.value !== (tr.durationMin ?? 0);
  const distanceChanged = distanceM.value !== (tr.distanceM ?? 0);
  const noteChanged = (form.note ?? "").trim() !== String(tr.note ?? "").trim();

  return nameChanged || typeChanged || durationChanged || distanceChanged || noteChanged;
});

const avgSpeedKmh = computed(() => {
  const dKm = distanceM.value / 1000;
  const h = durationMin.value / 60;
  if (dKm <= 0 || h <= 0) return 0;
  return dKm / h;
});

function paceMinPerKm(speedKmh: number) {
  if (speedKmh <= 0) return "--:--";
  const minPerKm = 60 / speedKmh;
  const m = Math.floor(minPerKm);
  const s = Math.round((minPerKm - m) * 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

const avgPace = computed(() => paceMinPerKm(avgSpeedKmh.value));

async function createTraining() {
  if (!canSave.value) return;

  await store.create({
    name: form.name.trim(),
    type: form.type,
    distanceM: distanceM.value,
    durationMin: durationMin.value,
    note: form.note?.trim() || null,
  });

  hydrateFromSelected();
}

async function saveTraining() {
  const id = store.selectedId;
  if (!id || !canSave.value) return;

  await store.update(id, {
    name: form.name.trim(),
    type: form.type,
    distanceM: distanceM.value,
    durationMin: durationMin.value,
    note: form.note?.trim() || null,
  });

  hydrateFromSelected();
}

async function removeTraining() {
  const id = store.selectedId;
  if (!id) return;

  const ok = confirm(t("training.confirm.delete"));
  if (!ok) return;

  await store.removeTraining(id);

  if (store.mode === "create") resetForCreate();
  else hydrateFromSelected();
}


function switchToCreate() {
  store.setMode("create");
  store.selectById(null);
  resetForCreate();
}

onMounted(async () => {
  if (!store.items.length) await store.fetchList();

  if (store.mode === "create") resetForCreate();
  else hydrateFromSelected();
});

watch(
    () => store.selected,
    () => {
      if (store.mode === "create") resetForCreate();
      else hydrateFromSelected();
    },
    { immediate: true }
);

watch(
    () => store.mode,
    (m) => {
      if (m === "create") resetForCreate();
    }
);
</script>
