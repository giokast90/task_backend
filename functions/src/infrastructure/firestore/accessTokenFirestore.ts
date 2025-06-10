import {db} from "../../config/firebase";
import {AccessTokenRepository} from
  "../../domain/repositories/accessTokenRepository";
import {AccessToken} from "../../domain/models/accessToken";
import moment from "moment-timezone";
const accessTokenCollection = db.collection("accessTokens");

/**
 * Firestore implementation of AccessTokenRepository.
 * Handles operations related to managing access tokens in Firestore.
 */
export class AccessTokenFirestore implements AccessTokenRepository {
  /**
   * Creates a new access token in Firestore.
   * @param {AccessToken} accessToken - The access token to be created.
   * @return {Promise<AccessToken>} The created access token including its ID.
   */
  async createAccessToken(accessToken: AccessToken): Promise<AccessToken> {
    const token = await accessTokenCollection.add(accessToken);
    const tokenData = await token.get();
    return {
      id: token.id,
      ...tokenData.data(),
    } as AccessToken;
  }

  /**
   * Checks if an access token is valid by verifying its ID, expiration,
   * and revocation status.
   * @param {string} id - The ID of the access token to validate.
   * @return {Promise<boolean>} True if the token is valid, otherwise false.
   */
  async validToken(id: string): Promise<boolean> {
    const currentTime = moment().tz("America/Managua").toDate();
    const tokenSnapshot = await accessTokenCollection
      .where("id", "==", id)
      .where("expiresAt", ">", currentTime)
      .where("revoked", "==", false)
      .get();
    return tokenSnapshot.docs.length > 0;
  }
}
