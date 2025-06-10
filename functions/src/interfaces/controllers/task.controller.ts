import {Request, Response} from "express";
import {TaskRepository} from "../../domain/repositories/taskRepository";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line require-jsdoc
export class TaskController {
  // eslint-disable-next-line require-jsdoc
  constructor(private taskRepo: TaskRepository) {}

  getAll = async (req: Request, res: Response) => {
    const tasks = await this.taskRepo.getAll();
    res.json(tasks);
  };

  getById = async (req: Request, res: Response) => {
    const task = await this.taskRepo.getById(req.params.id);
    if (!task) {
      res.status(404).json({message: "Task not found"});
    }
    res.json(task);
  };

  create = async (req: Request, res: Response) => {
    const id = uuidv4();
    await this.taskRepo.create({...req.body, id, completed: false});
    res.status(201).json({id});
  };

  update = async (req: Request, res: Response) => {
    await this.taskRepo.update(req.params.id, req.body);
    res.status(204);
  };

  delete = async (req: Request, res: Response) => {
    await this.taskRepo.delete(req.params.id);
    res.status(204);
  };

  markAsCompleted = async (req: Request, res: Response) => {
    await this.taskRepo.markAsCompleted(req.params.id);
    res.status(204);
  };
}
