/**
 * Entry point for Firebase Cloud Functions that initializes an Express app
 * to handle HTTP requests. It sets up middleware for handling CORS, JSON
 * request parsing, and defines routes for user and task-related operations.
 */
import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import taskRoutes from "./interfaces/routes/task.routes";
import userRoutes from "./interfaces/routes/user.routes";

const app = express();

/**
 * Middleware to enable Cross-Origin Resource Sharing (CORS),
 * allowing the app to accept requests from different origins.
 */
app.use(cors());

/**
 * Middleware to parse incoming requests with JSON payloads.
 */
app.use(express.json());

/**
 * Route group for task-related endpoints. All task operations,
 * such as fetching, creating, updating, and deleting tasks,
 * are handled here.
 */
app.use("/tasks", taskRoutes);

/**
 * Route group for user-related endpoints. Includes operations such
 * as user login and user account creation.
 */
app.use("/users", userRoutes);

/**
 * Firebase Cloud Function to handle HTTP requests, starting from the
 * defined Express app instance.
 */
export const api = functions.https.onRequest(app);
