import {db} from "../../config/firebase";
import {TaskRepository} from "../../domain/repositories/taskRepository";
import {Task} from "../../domain/models/task";
const taskCollection = db.collection("tasks");

/**
 * Firestore implementation of the TaskRepository interface.
 * This class provides methods to perform CRUD operations
 * on tasks in Firestore.
 */
export class TaskFirestore implements TaskRepository {
  /**
   * Retrieves all tasks from the database, ordered by their creation date
   * in descending order.
   * @return {Promise<Task[]>} A promise that resolves to an array of Task
   * objects.
   */
  async getAll(): Promise<Task[]> {
    const snapshot = await taskCollection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}) as Task);
  }

  /**
   * Retrieves a task by its unique ID.
   * @param {string} id - The unique ID of the task.
   * @return {Promise<Task | null>} A promise that resolves
   * to the Task object if found, or null if not.
   */
  async getById(id: string): Promise<Task | null> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Task;
  }

  /**
   * Creates a new task in the database.
   * @param {Task} task - The task object to create.
   * If `createdAt` is not provided, it will be set to the current date.
   * @return {Promise<string>} A promise that resolves
   * to the ID of the newly created task.
   */
  async create(task: Task): Promise<string> {
    if (!task.createdAt) task.createdAt = new Date();
    const ref = await taskCollection.add(task);
    return ref.id;
  }

  /**
   * Updates an existing task in the database by its unique ID.
   * @param {string} id - The unique ID of the task to update.
   * @param {Partial<Task>} task - The partial task object containing
   * updated fields.
   * @return {Promise<void>} A promise that resolves when
   * the update operation is complete.
   */
  async update(id: string, task: Partial<Task>): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update(task);
  }

  /**
   * Deletes a task from the database by its unique ID.
   * @param {string} id - The unique ID of the task to delete.
   * @return {Promise<void>} A promise that resolves when
   * the delete operation is complete.
   */
  async delete(id: string): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.delete();
  }

  /**
   * Marks a task as completed in the database by its unique ID.
   * @param {string} id - The unique ID of the task to mark as completed.
   * @return {Promise<void>} A promise that resolves when
   * the operation is complete.
   */
  async markAsCompleted(id: string): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({completed: true});
  }
}
