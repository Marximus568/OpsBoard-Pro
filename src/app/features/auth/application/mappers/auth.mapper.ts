import { User } from '../../domain/entities/user.entity';
import { AuthToken } from '../../domain/value-objects/auth-token.vo';

/**
 * Data Transfer Object representing a user in the backend.
 */
export interface UserDto {
    uuid: string;
    user_email: string;
    password?: string;
    full_name: string;
    permission_roles: string[];
}

/**
 * Data Transfer Object representing the authentication response.
 */
export interface AuthResponseDto {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user_data: UserDto;
}

/**
 * Mapper responsible for transforming data between Application/Domain and Infrastructure formats.
 * Located in the Application layer to ensure Domain objects are created according to business types.
 */
export class AuthMapper {
    /**
     * Transforms a UserDto from the Infrastructure layer into a User Domain Entity.
     * @param dto The raw user data from the API.
     * @returns A fresh User entity instance.
     */
    static toDomainUser(dto: UserDto): User {
        return new User({
            id: dto.uuid,
            email: dto.user_email,
            password: dto.password,
            fullName: dto.full_name,
            roles: dto.permission_roles
        });
    }

    /**
     * Transforms an AuthResponseDto into a Domain AuthToken value object.
     * @param dto The raw response from the authentication endpoint.
     * @returns An AuthToken value object with calculated expiration.
     */
    static toDomainToken(dto: AuthResponseDto): AuthToken {
        return new AuthToken(
            dto.access_token,
            dto.refresh_token,
            Date.now() + (dto.expires_in * 1000)
        );
    }
}
