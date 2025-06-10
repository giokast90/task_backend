import {Task} from "../models/task";

export interface TaskRepository {
    /**
     * Retrieves all tasks from the repository.
     * @returns A promise that resolves to an array of Task objects.
     */
    getAll(): Promise<Task[]>;

    /**
     * Retrieves a task by its unique identifier.
     * @param id - The ID of the task to retrieve.
     * @returns A promise that resolves to the Task object if found,
     * or null if not found.
     */
    getById(id: string): Promise<Task | null>;

    /**
     * Creates a new task in the repository.
     * @param task - The Task object to be created.
     * @returns A promise that resolves to the unique ID of the created task.
     */
    create(task: Task): Promise<string>;

    /**
     * Updates an existing task in the repository.
     * @param id - The unique ID of the task to update.
     * @param task - A partial representation of the Task object with
     * the properties to update.
     * @returns A promise that resolves when the update is complete.
     */
    update(id: string, task: Partial<Task>): Promise<void>;

    /**
     * Deletes a task from the repository by its unique identifier.
     * @param id - The ID of the task to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(id: string): Promise<void>;

    /**
     * Marks a task as completed in the repository based on its unique
     * identifier.
     * @param id - The ID of the task to mark as completed.
     * @returns A promise that resolves when the task is marked as completed.
     */
    markAsCompleted(id: string): Promise<void>;
}
