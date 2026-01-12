import { describe, expect, it } from "vitest";
import {
    validateEmail,
    validatePassword,
    validatePasswordConfirm,
    validateCurrentPassword,
    validateRequired,
    validateNewPassword,
} from "./validators";

describe("auth validators", () => {
    describe("validateEmail", () => {
        it("returns required when empty/whitespace", () => {
            expect(validateEmail("")).toBe("auth.errors.email.required");
            expect(validateEmail("   ")).toBe("auth.errors.email.required");
        });

        it("returns invalid when not matching simple email regex", () => {
            expect(validateEmail("abc")).toBe("auth.errors.email.invalid");
            expect(validateEmail("abc@")).toBe("auth.errors.email.invalid");
            expect(validateEmail("abc@domain")).toBe("auth.errors.email.invalid");
            expect(validateEmail("abc@domain.")).toBe("auth.errors.email.invalid");
        });

        it("returns undefined for valid email", () => {
            expect(validateEmail("test@example.com")).toBeUndefined();
            expect(validateEmail("dev@silex.local")).toBeUndefined(); // pasuje do Twojego regexa
        });
    });

    describe("validatePassword", () => {
        it("returns required when empty/whitespace", () => {
            expect(validatePassword("")).toBe("auth.errors.password.required");
            expect(validatePassword("   ")).toBe("auth.errors.password.required");
        });

        it("returns tooShort when length < 8", () => {
            expect(validatePassword("1234567")).toBe("auth.errors.password.tooShort");
        });

        it("returns undefined for length >= 8", () => {
            expect(validatePassword("12345678")).toBeUndefined();
            expect(validatePassword("supersecure")).toBeUndefined();
        });
    });

    describe("validateNewPassword", () => {
        it("delegates to validatePassword", () => {
            expect(validateNewPassword("")).toBe("auth.errors.password.required");
            expect(validateNewPassword("1234567")).toBe("auth.errors.password.tooShort");
            expect(validateNewPassword("12345678")).toBeUndefined();
        });
    });

    describe("validateCurrentPassword", () => {
        it("returns required when empty/whitespace", () => {
            expect(validateCurrentPassword("")).toBe("auth.errors.password.required");
            expect(validateCurrentPassword("   ")).toBe("auth.errors.password.required");
        });

        it("returns undefined when provided", () => {
            expect(validateCurrentPassword("x")).toBeUndefined();
            expect(validateCurrentPassword("123")).toBeUndefined();
        });
    });

    describe("validateRequired", () => {
        it("returns key when empty/whitespace", () => {
            expect(validateRequired("", "auth.errors.email.required")).toBe("auth.errors.email.required");
            expect(validateRequired("   ", "auth.errors.email.required")).toBe("auth.errors.email.required");
        });

        it("returns undefined when provided", () => {
            expect(validateRequired("ok", "auth.errors.email.required")).toBeUndefined();
        });
    });

    describe("validatePasswordConfirm", () => {
        it("returns required when confirm empty/whitespace", () => {
            expect(validatePasswordConfirm("abc", "")).toBe("auth.errors.confirmPassword.required");
            expect(validatePasswordConfirm("abc", "   ")).toBe("auth.errors.confirmPassword.required");
        });

        it("returns mismatch when not equal", () => {
            expect(validatePasswordConfirm("abc", "abcd")).toBe("auth.errors.confirmPassword.mismatch");
        });

        it("returns undefined when equal", () => {
            expect(validatePasswordConfirm("abc", "abc")).toBeUndefined();
        });
    });
});
