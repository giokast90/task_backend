import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {UserRepository} from "../../domain/repositories/userRepository";
import {AccessTokenRepository}
  from "../../domain/repositories/accessTokenRepository";
import moment from "moment-timezone";
import {AccessToken} from "../../domain/models/accessToken";
import jwt from "jsonwebtoken";

/**
 * Manages user-related operations, including login and user creation,
 * along with associated access token operations.
 */
export class UserController {
  /**
   * Constructs a new UserController instance.
   * @param {UserRepository} userRepo - Repository for managing user data.
   * @param {AccessTokenRepository} tokenRepository - Repository for managing
   * access tokens.
   */
  constructor(
      private userRepo: UserRepository,
      private tokenRepository: AccessTokenRepository
  ) {}

  /**
   * Login by email and generate the access token.
   * @param {Request} req - The Express request object containing
   * the email in the body.
   * @param {Response} res - The Express response object used
   * to send the response.
   * @return {Promise<void>} A promise resolving to an HTTP response
   * with the access token.
   */
  login = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) return res.status(400).json({message: "Email required"});
    const user = await this.userRepo.findByEmail(email);
    if (!user) return res.status(404).json({message: "User not found"});

    const accessToken = await this.createAccessToken(user.id);
    const token = jwt.sign({token: accessToken}, "atom_secret");
    return res.json({accessToken: token});
  };

  /**
   * Create a new user and generate the access token.
   * @param {Request} req - The Express request object containing
   * the email in the body.
   * @param {Response} res - The Express response object used to send
   * the response.
   * @return {Promise<void>} A promise resolving to an HTTP response with
   * the access token.
   */
  create = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) return res.status(400).json({message: "Email required"});
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      return res.status(409).json(
        {message: "Email already registered"}
      );
    }

    const id = uuidv4();
    await this.userRepo.create({id, email});
    const accessToken = await this.createAccessToken(id);
    const token = jwt.sign({token: accessToken}, "atom_secret");
    return res.status(201).json({accessToken: token});
  };

  /**
   * Create a new access token for a user.
   * @param {string} userId - The ID of the user for whom
   * the access token is created.
   * @return {Promise<AccessToken>} A promise resolving to the newly
   * created access token.
   */
  createAccessToken = async (userId: string): Promise<AccessToken> => {
    const now = moment().tz("America/Managua");
    const expiresAt = now.add(1, "year").toDate();
    const id = uuidv4();
    const accessToken = {id, userId, expiresAt, revoked: false};
    // eslint-disable-next-line max-len
    return this.tokenRepository.createAccessToken({...accessToken});
  };
}
