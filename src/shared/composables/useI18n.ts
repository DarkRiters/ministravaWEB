import { useLocale } from "./useLocale";
import { messages, type MessageKey, type Locale } from "../i18n/messages";

function formatMessage(
    template: string,
    params?: Record<string, string | number>
): string {
    if (!params) return template;

    return template.replace(/\{(\w+)\}/g, (_, key: string) => {
        const value = params[key];
        return value !== undefined ? String(value) : "";
    });
}

export function useI18n() {
    const { locale } = useLocale();

    function t(key: MessageKey, params?: Record<string, string | number>): string {
        const currentLocale = locale.value as Locale;

        const dict = messages[currentLocale] as Record<MessageKey, string>;

        const msg = dict[key] ?? key;
        return formatMessage(msg, params);
    }

    return {
        t,
        locale,
    };
}
