export class AuthToken {
    constructor(
        public readonly token: string,
        public readonly refreshToken: string,
        public readonly expiresAt: number,
    ) {
        if (!token) throw new Error('Token is required');
    }

    get isExpired(): boolean {
        return Date.now() >= this.expiresAt;
    }
}
