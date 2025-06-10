import {db} from "../../config/firebase";
import {UserRepository} from "../../domain/repositories/userRepository";
import {User} from "../../domain/models/user";

/**
 * Represents the Firestore "users" collection, storing user-related data
 * for CRUD operations.
 */
const userCollection = db.collection("users");

/**
 * Firestore implementation of the UserRepository interface.
 * This class provides methods for managing users in the Firestore database,
 * including finding users by email and creating new user records.
 */
export class UserFirestore implements UserRepository {
  /**
   * Finds a user by their email address in the Firestore "users" collection.
   * @param {string} email - The email address used to locate the user.
   * @return {Promise<User | null>} - A promise resolving to the user object
   * if found,or null if not.
   */
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await userCollection
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as User;
  }

  /**
   * Creates a new user document in the Firestore "users" collection.
   * @param {User} user - The user object containing information to be stored.
   * @return {Promise<void>} - A promise that resolves when the user
   * is successfully created.
   */
  async create(user: User): Promise<void> {
    await userCollection.doc(user.id).set(user);
  }
}
