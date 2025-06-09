import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {UserFirestore} from "../../infrastructure/firestore/userFirestore";

// eslint-disable-next-line new-cap
const router = Router();
const controller = new UserController(new UserFirestore());

router.post("/login", (req, res) => controller.login(req, res));
router.post("/", (req, res) => controller.create(req, res));

export default router;
