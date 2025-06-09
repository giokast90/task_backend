import {db} from "../../config/firebase";
import {UserRepository} from "../../domain/repositories/userRepository";
import {User} from "../../domain/models/user";
const userCollection = db.collection("users");

// eslint-disable-next-line require-jsdoc
export class UserFirestore implements UserRepository {
  // eslint-disable-next-line require-jsdoc
  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await userCollection
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as User;
  }

  // eslint-disable-next-line require-jsdoc
  async create(user: User): Promise<void> {
    await userCollection.doc(user.id).set(user);
  }
}
