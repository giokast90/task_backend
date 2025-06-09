export interface AccessToken {
    id: string;
    userId: string;
    revoked: boolean;
    expiresAt: Date;
}
