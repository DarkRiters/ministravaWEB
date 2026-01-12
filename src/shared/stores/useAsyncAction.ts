import { ref } from "vue";

export type UiError = {
    code: string;
    message: string;
    status?: number;
};

function normalizeError(e: unknown): UiError {
    const anyErr = e as any;

    const status = anyErr?.response?.status;
    const msg =
        anyErr?.response?.data?.message ||
        anyErr?.message ||
        "Unknown error";

    const code =
        anyErr?.response?.data?.code ||
        (status ? `HTTP_${status}` : "UNKNOWN");

    return { code, message: String(msg), status };
}

export function useAsyncAction() {
    const isLoading = ref(false);
    const error = ref<UiError | null>(null);

    function clearError() {
        error.value = null;
    }

    function reset() {
        isLoading.value = false;
        error.value = null;
    }

    async function run<T>(fn: () => Promise<T>): Promise<T | null> {
        isLoading.value = true;
        error.value = null;

        try {
            const result = await fn();
            return result;
        } catch (e) {
            error.value = normalizeError(e);
            return null;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        isLoading,
        error,
        clearError,
        reset,
        run,
    };
}
