import type { MessageKey } from '../../../shared/i18n/messages.ts';

export interface ValidationErrors {
    [key: string]: MessageKey | undefined;
}

export function validateEmail(email: string): MessageKey | undefined {
    if (!email.trim()) return 'auth.errors.email.required';
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) return 'auth.errors.email.invalid';
    return undefined;
}

export function validatePassword(password: string): MessageKey | undefined {
    if (!password.trim()) return 'auth.errors.password.required';
    if (password.length < 8) return 'auth.errors.password.tooShort';
    return undefined;
}
export function validateNewPassword(password: string): MessageKey | undefined {
    return validatePassword(password);
}

export function validateCurrentPassword(password: string): MessageKey | undefined {
    if (!password.trim()) return "auth.errors.password.required";
    return undefined;
}
export function validateRequired(
    value: string,
    key: MessageKey,
): MessageKey | undefined {
    if (!value.trim()) return key;
    return undefined;
}

export function validatePasswordConfirm(
    password: string,
    confirmPassword: string,
): MessageKey | undefined {
    if (!confirmPassword.trim()) return 'auth.errors.confirmPassword.required';
    if (confirmPassword !== password) return 'auth.errors.confirmPassword.mismatch';
    return undefined;
}
