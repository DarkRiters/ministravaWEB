import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Training } from "../domain/Training";
import type { TrainingInput } from "../domain/TrainingDTO";
import { TrainingFactory } from "../domain/TrainingFactory";
import { TrainingService } from "../services/TrainingService";
import { useAsyncAction } from "../../../shared/stores/useAsyncAction";

export type TrainingMode = "details" | "create";

export const useTrainingStore = defineStore("training", () => {
    const items = ref<Training[]>([]);
    const selected = ref<Training | null>(null);
    const mode = ref<TrainingMode>("details");

    const listAction = useAsyncAction();
    const mutateAction = useAsyncAction();

    const hasAny = computed(() => items.value.length > 0);
    const selectedId = computed(() => selected.value?.id ?? null);

    function setMode(next: TrainingMode) {
        mode.value = next;
    }

    function selectById(id: number | null) {
        selected.value = id === null ? null : items.value.find((x) => x.id === id) ?? null;
        if (!selected.value && mode.value === "details") mode.value = "create";
    }

    function reset() {
        items.value = [];
        selected.value = null;
        mode.value = "create";
        listAction.reset();
        mutateAction.reset();
    }

    async function fetchList() {
        const dtos = await listAction.run(() => TrainingService.list());
        if (!dtos) return;

        items.value = dtos.map(TrainingFactory.fromDTO);

        if (mode.value === "details" && !selected.value) {
            selected.value = items.value[0] ?? null;
            if (!selected.value) mode.value = "create";
        }
    }

    async function fetchDetails(id: number) {
        const dto = await listAction.run(() => TrainingService.get(id));
        if (!dto) return;

        const tr = TrainingFactory.fromDTO(dto);
        selected.value = tr;

        const idx = items.value.findIndex((x) => x.id === id);
        if (idx >= 0) items.value[idx] = tr;
        else items.value.unshift(tr);

        mode.value = "details";
    }

    async function create(payload: TrainingInput) {
        const dto = await mutateAction.run(() => TrainingService.create(payload));
        if (!dto) return;

        const created = TrainingFactory.fromDTO(dto);
        items.value.unshift(created);
        selected.value = created;
        mode.value = "details";
    }

    async function update(id: number, payload: TrainingInput) {
        const dto = await mutateAction.run(() => TrainingService.update(id, payload));
        if (!dto) return;

        const updated = TrainingFactory.fromDTO(dto);
        selected.value = updated;

        const idx = items.value.findIndex((x) => x.id === id);
        if (idx >= 0) items.value[idx] = updated;
    }

    async function removeTraining(id: number) {
        const ok = await mutateAction.run(async () => {
            await TrainingService.remove(id);
            return true;
        });
        if (!ok) return;

        items.value = items.value.filter((x) => x.id !== id);

        if (selected.value?.id === id) {
            selected.value = items.value[0] ?? null;
            mode.value = selected.value ? "details" : "create";
        }
    }

    return {
        items,
        selected,
        selectedId,
        mode,
        hasAny,

        isLoading: listAction.isLoading,
        isMutating: mutateAction.isLoading,
        error: computed(() => listAction.error.value ?? mutateAction.error.value),

        setMode,
        selectById,
        reset,
        fetchList,
        fetchDetails,
        create,
        update,
        removeTraining,
    };
});
