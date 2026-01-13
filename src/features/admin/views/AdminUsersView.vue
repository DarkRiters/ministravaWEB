<template>
  <div class="app-page app-shell">
    <div class="max-w-6xl mx-auto space-y-6">
      <div class="app-surface p-6 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <div class="space-y-1">
            <h1 class="text-lg font-semibold">{{ t("admin.users.title") }}</h1>
            <div class="text-xs opacity-70">
              {{ t("admin.users.total", { count: store.total }) }}
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button class="app-button-secondary px-3 py-2 text-sm" @click="store.fetchUsers()" :disabled="store.isLoading">
              {{ t("common.actions.refresh") }}
            </button>

            <button class="app-button" @click="openCreate()" :disabled="store.isLoading">
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
          {{ t("common.states.loading") }}
        </div>

        <div v-else class="space-y-2">
          <div v-if="(store.users?.length ?? 0) === 0" class="app-card p-6 text-center text-sm opacity-70">
            {{ t("admin.users.empty") }}
          </div>

          <div
              v-for="u in (store.users ?? [])"
              :key="u.id"
              class="app-card p-4 flex items-start justify-between gap-4"
          >
            <div class="min-w-0 flex-1 space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div class="min-w-0">
                  <div class="text-xs opacity-60">ID: {{ u.id }}</div>

                  <div class="font-semibold leading-tight truncate">
                    {{ fullName(u) }}
                  </div>

                  <div class="text-sm opacity-80 truncate">
                    {{ u.email ?? "—" }}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                <FieldRow labelKey="admin.fields.first_name" :value="u.first_name" />
                <FieldRow labelKey="admin.fields.last_name" :value="u.last_name" />
                <FieldRow labelKey="admin.fields.birth_date" :value="u.birth_date" />
                <FieldRow labelKey="admin.fields.gender" :value="u.gender" />
                <FieldRow labelKey="admin.fields.height" :value="u.height" />
                <FieldRow labelKey="admin.fields.weight" :value="u.weight" />
                <FieldRow labelKey="admin.fields.created_at" :value="formatDateTime(u.created_at)" />
                <FieldRow labelKey="admin.fields.updated_at" :value="formatDateTime(u.updated_at)" />
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button class="app-button-secondary px-3 py-2 text-xs" @click="openEdit(u)">
                {{ t("admin.users.edit") }}
              </button>

              <button class="app-button-danger px-3 py-2 text-xs" @click="confirmDelete(u)">
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
            <button class="app-button-secondary px-3 py-2 text-sm" @click="closeCreate">
              {{ t("common.actions.close") }}
            </button>
          </div>

          <div class="space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.first_name") }}</label>
                <input v-model="createForm.first_name" class="mt-1 app-input" />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.last_name") }}</label>
                <input v-model="createForm.last_name" class="mt-1 app-input" />
              </div>
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
              <button class="app-button-secondary flex-1" @click="closeCreate" :disabled="modalBusy">
                {{ t("common.cancel") }}
              </button>

              <button class="app-button flex-1" @click="submitCreate" :disabled="modalBusy || !canCreate">
                {{ modalBusy ? t("common.states.loading") : t("common.save") }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- EDIT MODAL -->
      <div v-if="editOpen" class="app-overlay">
        <div class="app-backdrop" @click="closeEdit"></div>

        <div class="relative w-full max-w-2xl app-surface p-6 space-y-4">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-lg font-semibold">{{ t("admin.users.edit") }}</h2>
            <button class="app-button-secondary px-3 py-2 text-sm" @click="closeEdit">
              {{ t("common.actions.close") }}
            </button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.first_name") }}</label>
                <input v-model="editForm.first_name" class="mt-1 app-input" />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.last_name") }}</label>
                <input v-model="editForm.last_name" class="mt-1 app-input" />
              </div>
            </div>

            <div>
              <label class="text-xs opacity-70">{{ t("auth.fields.email") }}</label>
              <input v-model="editForm.email" type="email" class="mt-1 app-input" />
              <div class="text-xs opacity-60 mt-1">
                {{ t("admin.users.emailNoChangeHint") }}
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.birth_date") }}</label>
                <input v-model="editForm.birth_date" type="date" class="mt-1 app-input" />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.gender") }}</label>
                <select v-model="editForm.gender" class="mt-1 app-input">
                  <option value="">—</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.height") }}</label>
                <input v-model="editForm.height" type="number" min="0" class="mt-1 app-input" />
              </div>

              <div>
                <label class="text-xs opacity-70">{{ t("admin.fields.weight") }}</label>
                <input v-model="editForm.weight" type="number" min="0" class="mt-1 app-input" />
              </div>
            </div>

            <div
                v-if="modalError"
                class="app-card p-4 border border-red-500/30 bg-red-500/5 text-sm text-slate-900 dark:text-slate-100"
            >
              <span class="font-medium">{{ t("common.error") }}:</span>
              {{ modalError }}
            </div>

            <div class="flex gap-2 pt-2">
              <button class="app-button-secondary flex-1" @click="closeEdit" :disabled="modalBusy">
                {{ t("common.cancel") }}
              </button>

              <button class="app-button flex-1" @click="submitEdit" :disabled="modalBusy || !canEdit">
                {{ modalBusy ? t("common.states.loading") : t("common.save") }}
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
            <button class="app-button-secondary flex-1" @click="closeDelete" :disabled="modalBusy">
              {{ t("common.cancel") }}
            </button>

            <button class="app-button-danger flex-1" @click="submitDelete" :disabled="modalBusy">
              {{ modalBusy ? t("common.states.loading") : t("common.actions.delete") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from "vue";
import { useI18n } from "../../../shared/composables/useI18n";
import { useAdminStore } from "../stores/adminStore";
import type { UserDTO } from "../../user/domain/UserDTO";
import { extractLaravelError, type UpdateUserPayload } from "../services/AdminService";

const { t } = useI18n();
const store = useAdminStore();

const modalBusy = ref(false);
const modalError = ref<string | null>(null);

function formatDateTime(v: unknown): string {
  if (v == null) return "—";
  const s = String(v);
  return s.slice(0, 19).replace("T", " ");
}

function fullName(u: UserDTO): string {
  const name = [u.first_name, u.last_name].filter(Boolean).join(" ").trim();
  return name.length ? name : (u.email ?? "—");
}

function toNullableNumber(v: unknown): number | null {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

const FieldRow = defineComponent({
  name: "FieldRow",
  props: {
    labelKey: { type: String, required: true },
    value: { type: [String, Number, Boolean, Object] as any, required: false },
  },
  setup(props) {
    return () =>
        h("div", { class: "flex gap-2 min-w-0" }, [
          h("span", { class: "text-xs opacity-60 w-24 shrink-0" }, t(props.labelKey as any)),
          h(
              "span",
              { class: "truncate" },
              props.value === null || props.value === undefined || props.value === "" ? "—" : String(props.value)
          ),
        ]);
  },
});

// CREATE
const createOpen = ref(false);
const createForm = reactive({
  first_name: "",
  last_name: "",
  email: "",
  password: "",
});

const canCreate = computed(() => {
  return (
      createForm.first_name.trim().length > 0 &&
      createForm.email.trim().length > 0 &&
      createForm.password.trim().length >= 8
  );
});

function openCreate() {
  modalError.value = null;
  createForm.first_name = "";
  createForm.last_name = "";
  createForm.email = "";
  createForm.password = "";
  createOpen.value = true;
}

function closeCreate() {
  createOpen.value = false;
}

// EDIT
const editOpen = ref(false);
const editTarget = ref<UserDTO | null>(null);

const editForm = reactive({
  first_name: "",
  last_name: "",
  email: "",
  birth_date: "" as string,
  gender: "" as string,
  height: "" as any,
  weight: "" as any,
  avatar: "" as string,
});

const canEdit = computed(() => editForm.email.trim().length > 0);

function openEdit(u: UserDTO) {
  modalError.value = null;
  editTarget.value = u;

  editForm.first_name = u.first_name ?? "";
  editForm.last_name = u.last_name ?? "";
  editForm.email = u.email ?? "";

  editForm.birth_date = (u.birth_date as any) ?? "";
  editForm.gender = (u.gender as any) ?? "";
  editForm.height = (u.height as any) ?? "";
  editForm.weight = (u.weight as any) ?? "";
  editForm.avatar = (u.avatar as any) ?? "";

  editOpen.value = true;
}

function closeEdit() {
  editOpen.value = false;
  editTarget.value = null;
}

// DELETE
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

// ACTIONS
async function submitCreate() {
  if (!canCreate.value) return;
  modalError.value = null;
  modalBusy.value = true;

  try {
    await store.createUser({
      first_name: createForm.first_name.trim(),
      last_name: createForm.last_name.trim() || null,
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
    const payload: UpdateUserPayload = {
      first_name: editForm.first_name.trim() || null,
      last_name: editForm.last_name.trim() || null,
      email: editForm.email.trim(),

      birth_date: editForm.birth_date || null,
      gender: editForm.gender || null,
      height: toNullableNumber(editForm.height),
      weight: toNullableNumber(editForm.weight),
      avatar: editForm.avatar.trim() || null,
    };

    await store.updateUser(editTarget.value.id, payload);

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
  store.fetchUsers();
});
</script>
