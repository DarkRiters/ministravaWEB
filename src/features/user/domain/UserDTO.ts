export type UserDTO = {
    id: number;

    email: string;
    email_verified_at?: string | null;

    first_name: string | null;
    last_name: string | null;

    birth_date?: string | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;

    avatar?: string | null;

    created_at: string;
    updated_at: string;

    is_admin?: boolean;
    roles?: string[];
};
