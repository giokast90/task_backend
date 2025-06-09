import {User} from "../models/user";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<void>;
}
