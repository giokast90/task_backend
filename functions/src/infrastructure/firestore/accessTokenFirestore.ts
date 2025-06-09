import {db} from "../../config/firebase";
// eslint-disable-next-line max-len
import {AccessTokenRepository} from "../../domain/repositories/accessTokenRepository";
import {AccessToken} from "../../domain/models/accessToken";
import moment from "moment-timezone";
const accessTokenCollection = db.collection("accessTokens");

// eslint-disable-next-line require-jsdoc
export class AccessTokenFirestore implements AccessTokenRepository {
  // eslint-disable-next-line require-jsdoc
  async createAccessToken(accessToken: AccessToken): Promise<AccessToken> {
    const token = await accessTokenCollection.add(accessToken);
    const tokenData = await token.get();
    return {
      id: token.id,
      ...tokenData.data(),
    } as AccessToken;
  }

  // eslint-disable-next-line require-jsdoc
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
