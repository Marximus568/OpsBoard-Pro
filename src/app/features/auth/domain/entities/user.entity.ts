export interface UserProps {
    id: string;
    email: string;
    password?: string;
    fullName: string;
    roles: string[];
}

export class User {
    constructor(private readonly props: UserProps) { }

    get id(): string { return this.props.id; }
    get email(): string { return this.props.email; }
    get password(): string | undefined { return this.props.password; }
    get fullName(): string { return this.props.fullName; }
    get roles(): string { return [...this.props.roles].join(', '); }

    hasRole(role: string): boolean {
        return this.props.roles.includes(role);
    }

    toJSON() {
        return { ...this.props };
    }
}
