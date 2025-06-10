import {Router} from "express";
import * as middleware from "../middlewares/authMiddleware";
import {TaskController} from "../controllers/task.controller";
import {TaskFirestore} from "../../infrastructure/firestore/taskFirestore";

// eslint-disable-next-line new-cap
const router = Router();
const controller = new TaskController(new TaskFirestore());
// eslint-disable-next-line import/namespace
router.use(middleware.passportAuthenticate); // Applying to all task routes

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res)=> controller.create(req, res));
router.put("/:id", (req, res)=> controller.update(req, res));
router.delete("/:id", (req, res)=> controller.delete(req, res));
router.patch("/:id/complete", (req, res)=>
  controller.markAsCompleted(req, res)
);

export default router;
