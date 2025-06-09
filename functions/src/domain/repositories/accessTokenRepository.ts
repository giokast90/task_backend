import {AccessToken} from "../models/accessToken";

export interface AccessTokenRepository {
  createAccessToken(accessToken: AccessToken): Promise<AccessToken>;
  validToken(id: string): Promise<boolean>;
}
