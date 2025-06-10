import {Router} from "express";
import * as middleware from "../middlewares/authMiddleware";
import {TaskController} from "../controllers/task.controller";
import {TaskFirestore} from "../../infrastructure/firestore/taskFirestore";

// eslint-disable-next-line new-cap
const router = Router();
const controller = new TaskController(new TaskFirestore());
// eslint-disable-next-line import/namespace
router.use(middleware.passportAuthenticate); // Applying to all task routes

// Route to get all tasks. Expects a GET request.
router.get("/", (req, res) => controller.getAll(req, res));
// Route to get a task by its ID. Expects a GET request
// with task ID as a URL parameter.
router.get("/:id", (req, res) => controller.getById(req, res));
// Route to create a new task. Expects a POST request
// with task details in the request body.
router.post("/", (req, res)=> controller.create(req, res));
// Route to update an existing task by its ID.
// Expects a PUT request with updated task details and
// task ID as a URL parameter.
router.put("/:id", (req, res)=> controller.update(req, res));
// Route to delete a task by its ID. Expects a
// DELETE request with task ID as a URL parameter.
router.delete("/:id", (req, res)=> controller.delete(req, res));
// Route to mark a task as completed by its ID.
// Expects a PATCH request with task ID as a URL parameter.
router.patch("/:id/complete", (req, res)=>
  controller.markAsCompleted(req, res)
);

export default router;
