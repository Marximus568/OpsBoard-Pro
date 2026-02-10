import { UserAdmin, Role, FeatureFlag, SystemConfig } from '../../domain/models/admin-entities';

export interface UserAdminDto {
    uuid: string;
    user_email: string;
    full_name: string;
    active: boolean;
    permission_roles: string[];
    createdAt: string;
}

export interface RoleDto {
    id: string;
    name: string;
    permissions: string[];
}

export interface FeatureFlagDto {
    id: string;
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    scope: 'GLOBAL' | 'INTERNAL' | 'BETA';
}

export interface SystemConfigDto {
    id: string;
    key: string;
    value: string;
    category: 'PREFERENCES' | 'SYSTEM' | 'SECURITY';
}

export class AdminMapper {
    static toDomainUser(dto: UserAdminDto): UserAdmin {
        return {
            uuid: dto.uuid,
            user_email: dto.user_email,
            full_name: dto.full_name,
            active: dto.active,
            permission_roles: dto.permission_roles,
            createdAt: dto.createdAt
        };
    }

    static toDomainRole(dto: RoleDto): Role {
        return {
            id: dto.id,
            name: dto.name,
            permissions: dto.permissions
        };
    }

    static toDomainFlag(dto: FeatureFlagDto): FeatureFlag {
        return {
            id: dto.id,
            key: dto.key,
            name: dto.name,
            description: dto.description,
            enabled: dto.enabled,
            scope: dto.scope
        };
    }

    static toDomainConfig(dto: SystemConfigDto): SystemConfig {
        return {
            id: dto.id,
            key: dto.key,
            value: dto.value,
            category: dto.category
        };
    }
}
