<template>
  <div class="app-page app-shell">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <h1 class="text-lg font-semibold">{{ t("admin.users.title") }}</h1>
            <div class="text-xs opacity-70">
              {{ store.total }} users
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
                class="app-button-secondary px-3 py-2 text-sm"
                @click="store.fetchUsers(1)"
                :disabled="store.isLoading"
            >
              {{ t("common.refresh") }}
            </button>

            <button
                class="app-button"
                @click="openCreate()"
                :disabled="store.isLoading"
            >
              {{ t("admin.users.create") }}
            </button>
          </div>
        </div>

        <div
            v-if="store.error"
            class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
        >
          <span class="font-medium">{{ t("common.error") }}:</span>
          {{ store.error }}
        </div>

        <div v-if="store.isLoading" class="text-sm opacity-70">
          {{ t("common.loading") }}
        </div>

        <div v-else class="space-y-2">
          <div
              v-if="(store.users?.length ?? 0) === 0"
              class="app-card p-6 text-center text-sm opacity-70"
          >
            Brak danych
          </div>

          <div
              v-for="u in (store.users ?? [])"
              :key="u.id"
              class="app-card p-4 flex items-center justify-between gap-4"
          >
            <div class="min-w-0">
              <div class="text-xs opacity-60">ID: {{ u.id }}</div>
              <div class="font-semibold leading-tight truncate">
                {{ u.name }}
              </div>
              <div class="text-sm opacity-80 truncate">
                {{ u.email }}
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button
                  class="app-button-secondary px-3 py-2 text-xs"
                  @click="openEdit(u)"
              >
                {{ t("admin.users.edit") }}
              </button>

              <button
                  class="app-button-danger px-3 py-2 text-xs"
                  @click="confirmDelete(u)"
              >
                {{ t("admin.users.delete") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CREATE MODAL -->
      <div v-if="createOpen" class="app-overlay">
        <div class="app-backdrop" @click="closeCreate"></div>

        <div class="relative w-full max-w-lg app-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">{{ t("admin.users.create") }}</h2>
            <button class="app-button-secondary px-3 py-2 text-sm" @click="closeCreate">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs opacity-70">{{ t("auth.fields.name") }}</label>
              <input v-model="createForm.name" class="mt-1 app-input" />
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("auth.fields.email") }}</label>
              <input v-model="createForm.email" type="email" class="mt-1 app-input" />
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("admin.users.password") }}</label>
              <input v-model="createForm.password" type="password" class="mt-1 app-input" />
            </div>

            <div
                v-if="modalError"
                class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
            >
              <span class="font-medium">{{ t("common.error") }}:</span>
              {{ modalError }}
            </div>

            <div class="flex gap-2 pt-2">
              <button
                  class="app-button-secondary flex-1"
                  @click="closeCreate"
                  :disabled="modalBusy"
              >
                {{ t("admin.users.cancel") }}
              </button>

              <button
                  class="app-button flex-1"
                  @click="submitCreate"
                  :disabled="modalBusy || !canCreate"
              >
                {{ modalBusy ? t("common.loading") : t("admin.users.save") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- EDIT MODAL -->
      <div v-if="editOpen" class="app-overlay">
        <div class="app-backdrop" @click="closeEdit"></div>

        <div class="relative w-full max-w-lg app-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">{{ t("admin.users.edit") }}</h2>
            <button class="app-button-secondary px-3 py-2 text-sm" @click="closeEdit">✕</button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="text-xs opacity-70">{{ t("auth.fields.name") }}</label>
              <input v-model="editForm.name" class="mt-1 app-input" />
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("auth.fields.email") }}</label>
              <input v-model="editForm.email" type="email" class="mt-1 app-input" />
            </div>

            <div
                v-if="modalError"
                class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
            >
              <span class="font-medium">{{ t("common.error") }}:</span>
              {{ modalError }}
            </div>

            <div class="flex gap-2 pt-2">
              <button
                  class="app-button-secondary flex-1"
                  @click="closeEdit"
                  :disabled="modalBusy"
              >
                {{ t("admin.users.cancel") }}
              </button>

              <button
                  class="app-button flex-1"
                  @click="submitEdit"
                  :disabled="modalBusy || !canEdit"
              >
                {{ modalBusy ? t("common.loading") : t("admin.users.save") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- DELETE MODAL -->
      <div v-if="deleteOpen" class="app-overlay">
        <div class="app-backdrop" @click="closeDelete"></div>

        <div class="relative w-full max-w-md app-surface p-6 space-y-4">
          <div class="text-lg font-semibold">{{ t("admin.users.confirmDelete") }}</div>

          <div class="text-sm opacity-70">
            {{ deleteTarget?.email }}
          </div>

          <div
              v-if="modalError"
              class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
          >
            <span class="font-medium">{{ t("common.error") }}:</span>
            {{ modalError }}
          </div>

          <div class="flex gap-2 pt-2">
            <button
                class="app-button-secondary flex-1"
                @click="closeDelete"
                :disabled="modalBusy"
            >
              {{ t("admin.users.cancel") }}
            </button>

            <button
                class="app-button-danger flex-1"
                @click="submitDelete"
                :disabled="modalBusy"
            >
              {{ modalBusy ? t("common.loading") : t("admin.users.delete") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useI18n } from "../../../shared/composables/useI18n";
import { useAdminStore } from "../stores/adminStore";
import type { UserDTO } from "../../user/domain/UserDTO";
import { extractLaravelError } from "../services/AdminService";

const { t } = useI18n();
const store = useAdminStore();

const modalBusy = ref(false);
const modalError = ref<string | null>(null);

const createOpen = ref(false);
const createForm = reactive({
  name: "",
  email: "",
  password: "",
});

const canCreate = computed(() => {
  return (
      createForm.name.trim().length > 0 &&
      createForm.email.trim().length > 0 &&
      createForm.password.trim().length >= 8
  );
});

function openCreate() {
  modalError.value = null;
  createForm.name = "";
  createForm.email = "";
  createForm.password = "";
  createOpen.value = true;
}

function closeCreate() {
  createOpen.value = false;
}

const editOpen = ref(false);
const editTarget = ref<UserDTO | null>(null);
const editForm = reactive({
  name: "",
  email: "",
});

const canEdit = computed(() => {
  return editForm.name.trim().length > 0 && editForm.email.trim().length > 0;
});

function openEdit(u: UserDTO) {
  modalError.value = null;
  editTarget.value = u;
  editForm.name = u.name ?? "";
  editForm.email = u.email ?? "";
  editOpen.value = true;
}

function closeEdit() {
  editOpen.value = false;
  editTarget.value = null;
}

const deleteOpen = ref(false);
const deleteTarget = ref<UserDTO | null>(null);

function confirmDelete(u: UserDTO) {
  modalError.value = null;
  deleteTarget.value = u;
  deleteOpen.value = true;
}

function closeDelete() {
  deleteOpen.value = false;
  deleteTarget.value = null;
}

async function submitCreate() {
  if (!canCreate.value) return;
  modalError.value = null;
  modalBusy.value = true;

  try {
    await store.createUser({
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      password_confirmation: createForm.password,
    });
    createOpen.value = false;
  } catch (e: unknown) {
    modalError.value = extractLaravelError(e, "Create failed.");
  } finally {
    modalBusy.value = false;
  }
}

async function submitEdit() {
  if (!editTarget.value || !canEdit.value) return;
  modalError.value = null;
  modalBusy.value = true;

  try {
    await store.updateUser(editTarget.value.id, {
      name: editForm.name.trim(),
      email: editForm.email.trim(),
    });
    editOpen.value = false;
    editTarget.value = null;
  } catch (e: unknown) {
    modalError.value = extractLaravelError(e, "Update failed.");
  } finally {
    modalBusy.value = false;
  }
}

async function submitDelete() {
  if (!deleteTarget.value) return;
  modalError.value = null;
  modalBusy.value = true;

  try {
    await store.deleteUser(deleteTarget.value.id);
    deleteOpen.value = false;
    deleteTarget.value = null;
  } catch (e: unknown) {
    modalError.value = extractLaravelError(e, "Delete failed.");
  } finally {
    modalBusy.value = false;
  }
}

onMounted(() => {
  store.fetchUsers(1);
});
</script>
