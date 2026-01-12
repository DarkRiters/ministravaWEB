import type { User } from "./User";
import type { UserDTO } from "./UserDTO";
import type { UserRole } from "./UserRole";

export class UserFactory {
    static fromApi(dto: UserDTO): User {
        const role: UserRole = dto.is_admin ? "admin" : "user";

        return {
            id: String(dto.id),
            name: dto.name,
            email: dto.email,
            role,
            createdAt: new Date(dto.created_at),
            updatedAt: new Date(dto.updated_at),
        };
    }
}
