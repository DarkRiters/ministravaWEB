import type { UserRole } from "./UserRole";

export interface User {
    id: string;

    name: string;
    email: string;
    role: UserRole;

    firstName: string | null;
    lastName: string | null;
    birthDate: string | null;
    gender: string | null;
    height: number | null;
    weight: number | null;
    avatar: string | null;

    createdAt: Date;
    updatedAt: Date;
}
