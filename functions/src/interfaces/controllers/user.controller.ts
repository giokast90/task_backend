import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {auth} from "../../config/firebase";
import {UserRepository} from "../../domain/repositories/userRepository";

// eslint-disable-next-line require-jsdoc
export class UserController {
  // eslint-disable-next-line require-jsdoc
  constructor(private userRepo: UserRepository) {}

  // Login by email and generate the access token
  login = async (req: Request, res: Response) => {
    const {email} = req.body;
    if (!email) return res.status(400).json({message: "Email required"});
    const user = await this.userRepo.findByEmail(email);
    if (!user) return res.status(404).json({message: "User not found"});

    const customToken = await auth.createCustomToken(user.id);
    return res.json({token: customToken});
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
    const customToken = await auth.createCustomToken(id);

    return res.status(201).json({token: customToken});
  };
}
