import { ref, computed } from 'vue';

export type Locale = 'pl' | 'en';

const locale = ref<Locale>('pl');
let initialized = false;

function applyLocale(value: Locale) {
    locale.value = value;
    localStorage.setItem('locale', value);
}

function initLocale() {
    if (initialized) return;

    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'pl' || saved === 'en') {
        applyLocale(saved);
    } else {
        applyLocale('pl');
    }

    initialized = true;
}

export function useLocale() {
    initLocale();

    return {
        locale: computed(() => locale.value),
        setLocale: applyLocale,
    };
}
