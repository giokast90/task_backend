import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {UserRepository} from "../../domain/repositories/userRepository";
// eslint-disable-next-line max-len
import {AccessTokenRepository} from "../../domain/repositories/accessTokenRepository";
import moment from "moment-timezone";
import {AccessToken} from "../../domain/models/accessToken";
import jwt from "jsonwebtoken";

// eslint-disable-next-line require-jsdoc
export class UserController {
  // eslint-disable-next-line require-jsdoc,max-len
  constructor(private userRepo: UserRepository, private tokenRepository: AccessTokenRepository) {}

  // Login by email and generate the access token
  login = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) return res.status(400).json({message: "Email required"});
    const user = await this.userRepo.findByEmail(email);
    if (!user) return res.status(404).json({message: "User not found"});

    const accessToken = await this.createAccessToken(user.id);
    const token = jwt.sign({token: accessToken}, "atom_secret");
    return res.json({accessToken: token});
  };

  // Create a new user and generate the access token
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

  createAccessToken = async (userId: string): Promise<AccessToken> => {
    const now = moment().tz("America/Managua");
    const expiresAt = now.add(1, "year").toDate();
    const id = uuidv4();
    const accessToken = {id, userId, expiresAt, revoked: false};
    // eslint-disable-next-line max-len
    return this.tokenRepository.createAccessToken({...accessToken});
  };
}
