export interface UserAdmin {
    uuid: string;
    user_email: string;
    full_name: string;
    active: boolean;
    permission_roles: string[];
    createdAt: string;
}

export interface Permission {
    resource: string;
    action: 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE';
}

export interface Role {
    id: string;
    name: string;
    permissions: string[]; // Standard permission keys
}

export interface FeatureFlag {
    id: string;
    key: string;
    name: string;
    description: string;
    enabled: boolean;
    scope: 'GLOBAL' | 'INTERNAL' | 'BETA';
}

export interface SystemConfig {
    id: string;
    key: string;
    value: string;
    category: 'PREFERENCES' | 'SYSTEM' | 'SECURITY';
}
