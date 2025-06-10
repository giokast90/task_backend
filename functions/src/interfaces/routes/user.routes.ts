// This file defines the user-related routes for the application
// using Express framework.
import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {UserFirestore} from "../../infrastructure/firestore/userFirestore";
import {AccessTokenFirestore}
  from "../../infrastructure/firestore/accessTokenFirestore";

// eslint-disable-next-line new-cap
const router = Router();
const controller = new UserController(
  new UserFirestore(),
  new AccessTokenFirestore()
);

// Route for user login. Expects a POST request containing user credentials.
router.post("/login", (req, res) => controller.login(req, res));

// Route for creating a new user. Expects a POST request with user details.
router.post("/", (req, res) => controller.create(req, res));

export default router;
