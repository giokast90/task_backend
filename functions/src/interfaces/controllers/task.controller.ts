import {Request, Response} from "express";
import {TaskRepository} from "../../domain/repositories/taskRepository";
import {v4 as uuidv4} from "uuid";

/**
 * Controller that handles operations related to task management.
 * Provides methods to create, retrieve, update, delete, and manage
 * the completion status of tasks.
 */
export class TaskController {
  /**
   * Constructs a new instance of TaskController.
   * Provides the necessary repository for managing task-related operations.
   *
   * @param {TaskRepository} taskRepo - The repository interface
   * for interacting with task data storage.
   */
  constructor(private taskRepo: TaskRepository) {}

  /**
   * Retrieves and returns all tasks from the underlying repository.
   * Sends the list of tasks as a JSON response to the client.
   *
   * @param {Request} req - The request object from the client.
   * @param {Response} res - The response object to send the retrieved tasks.
   * @return {Promise<void>} A promise that resolves when
   * the operation is complete.
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    const tasks = await this.taskRepo.getAll();
    res.json(tasks);
  };

  /**
   * Retrieves a specific task by its unique identifier.
   * If the task is found, it is sent as a JSON response; otherwise,
   * a 404 error is returned.
   *
   * @param {Request} req - The client request, including
   * the task ID in the parameters.
   * @param {Response} res - The server response, including
   * the task or an error message.
   * @return {Promise<void>} A promise that completes after
   * sending the response.
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    const task = await this.taskRepo.getById(req.params.id);
    if (!task) {
      res.status(404).json({message: "Task not found"});
    }
    res.json(task);
  };

  /**
   * Creates a new task with the data provided in the request body.
   * Assigns a unique ID and sets the task as incomplete by default.
   * Responds with the newly created task's ID.
   *
   * @param {Request} req - The request containing task details in the body.
   * @param {Response} res - The response to send the new task's ID.
   * @return {Promise<void>} A promise that resolves when
   * the new task is created.
   */
  create = async (req: Request, res: Response): Promise<void> => {
    const id = uuidv4();
    await this.taskRepo.create({...req.body, id, completed: false});
    res.status(201).json({id});
  };

  /**
   * Updates an existing task's data based on its unique ID.
   * Returns a status confirming the update was successful.
   *
   * @param {Request} req - The request with the task ID in parameters and
   * updated data in the body.
   * @param {Response} res - The response to confirm
   * the success of the operation.
   * @return {Promise<void>} A promise that resolves after updating the task.
   */
  update = async (req: Request, res: Response): Promise<void> => {
    await this.taskRepo.update(req.params.id, req.body);
    res.status(204).json({message: "Task updated"});
  };

  /**
   * Deletes a task from the repository identified by its unique ID.
   * Responds with confirmation that the task has been removed.
   *
   * @param {Request} req - The request containing the unique task ID
   * in parameters.
   * @param {Response} res - The response confirming the task's deletion.
   * @return {Promise<void>} A promise that resolves upon successful deletion.
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    await this.taskRepo.delete(req.params.id);
    res.status(204).send({message: "Task deleted"});
  };

  /**
   * Updates the status of a task to be marked as completed.
   * Identifies the task by its ID and confirms the operation success.
   *
   * @param {Request} req - The request containing the task ID in parameters.
   * @param {Response} res - The response confirming the task
   * was marked as completed.
   * @return {Promise<void>} A promise that resolves upon marking
   * the task completed.
   */
  markAsCompleted = async (req: Request, res: Response): Promise<void> => {
    await this.taskRepo.markAsCompleted(req.params.id);
    res.status(204).json({message: "Task marked as completed"});
  };
}
