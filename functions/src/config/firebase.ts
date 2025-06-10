/**
 * Firebase Admin SDK for accessing Firebase services,
 * such as Firestore and Authentication.
 */
import * as admin from "firebase-admin";

/**
 * Initializes the Firebase application with default settings.
 */
admin.initializeApp();

/**
 * Provides access to the Firestore database.
 */
export const db = admin.firestore();
