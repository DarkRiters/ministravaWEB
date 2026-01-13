import type { User } from "./User";
import type { UserDTO } from "./UserDTO";
import type { UserRole } from "./UserRole";

function computeRole(dto: UserDTO): UserRole {
    if (dto.is_admin === true) return "admin";
    if (Array.isArray(dto.roles) && dto.roles.includes("admin")) return "admin";
    return "user";
}

function computeName(dto: UserDTO): string {
    const full = [dto.first_name, dto.last_name].filter(Boolean).join(" ").trim();
    return full.length ? full : dto.email;
}

export class UserFactory {
    static fromApi(dto: UserDTO): User {
        return {
            id: String(dto.id),
            name: computeName(dto),
            email: dto.email,
            role: computeRole(dto),

            firstName: dto.first_name ?? null,
            lastName: dto.last_name ?? null,
            birthDate: dto.birth_date ?? null,
            gender: dto.gender ?? null,
            height: dto.height ?? null,
            weight: dto.weight ?? null,
            avatar: dto.avatar ?? null,

            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updated_at),
        };
    }
}
