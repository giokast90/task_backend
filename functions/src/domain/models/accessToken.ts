/**
 * Represents an access token used for
 * authenticating and authorizing user requests.
 */
export interface AccessToken {
    /**
     * Unique identifier of the access token.
     */
    id: string;

    /**
     * Identifier of the user associated with the access token.
     */
    userId: string;

    /**
     * Indicates whether the token has been revoked and is no longer valid.
     */
    revoked: boolean;

    /**
     * The expiration date and time of the access token.
     */
    expiresAt: Date;
}
