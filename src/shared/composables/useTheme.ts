import { ref, computed } from 'vue';

export type Theme = 'light' | 'dark';

const theme = ref<Theme>('light');
let initialized = false;

function applyTheme(value: Theme) {
    theme.value = value;

    const root = document.documentElement;

    if (value === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }

    localStorage.setItem('theme', value);
}

function initTheme() {
    if (initialized) return;

    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
        applyTheme(saved);
    } else {
        applyTheme('light');
    }

    initialized = true;
}

export function useTheme() {
    initTheme();

    return {
        theme: computed(() => theme.value),
        setTheme: applyTheme,
        toggleTheme: () => applyTheme(theme.value === 'light' ? 'dark' : 'light'),
    };
}
