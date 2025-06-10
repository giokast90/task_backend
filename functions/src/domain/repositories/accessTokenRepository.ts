import {AccessToken} from "../models/accessToken";

export interface AccessTokenRepository {
  /**
   * Creates a new access token in the repository.
   * @param {AccessToken} accessToken - The access token object to be created.
   * @return {Promise<AccessToken>} A promise that resolves with the created
   * access token.
   */
  createAccessToken(accessToken: AccessToken): Promise<AccessToken>;

  /**
   * Checks if an access token is valid based on the given ID.
   * @param {string} id - The ID of the access token to validate.
   * @return {Promise<boolean>} A promise that resolves with `true` if the token
   * is valid otherwise `false`.
   */
  validToken(id: string): Promise<boolean>;
}
