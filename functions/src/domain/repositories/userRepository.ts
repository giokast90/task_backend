import {User} from "../models/user";

/**
 * UserRepository defines the contract for user data management operations.
 */
export interface UserRepository {
    /**
     * Finds and retrieves a user by their email address.
     * @param email - The email address of the user to be retrieved.
     * @returns A Promise that resolves to the User object if found,
     * otherwise null.
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Creates a new user in the repository.
     * @param user - The User object to be created.
     * @returns A Promise that resolves when the creation process is complete.
     */
    create(user: User): Promise<void>;
}
