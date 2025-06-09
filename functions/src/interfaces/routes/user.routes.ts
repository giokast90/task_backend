import {Router} from "express";
import {UserController} from "../controllers/user.controller";
import {UserFirestore} from "../../infrastructure/firestore/userFirestore";
// eslint-disable-next-line max-len
import {AccessTokenFirestore} from "../../infrastructure/firestore/accessTokenFirestore";

// eslint-disable-next-line new-cap
const router = Router();
// eslint-disable-next-line max-len
const controller = new UserController(new UserFirestore(), new AccessTokenFirestore());

router.post("/login", (req, res) => controller.login(req, res));
router.post("/", (req, res) => controller.create(req, res));

export default router;
