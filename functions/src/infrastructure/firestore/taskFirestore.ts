import {db} from "../../config/firebase";
import {TaskRepository} from "../../domain/repositories/taskRepository";
import {Task} from "../../domain/models/task";
const taskCollection = db.collection("tasks");

// eslint-disable-next-line require-jsdoc
export class TaskFirestore implements TaskRepository {
  // eslint-disable-next-line require-jsdoc
  async getAll(): Promise<Task[]> {
    const snapshot = await taskCollection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}) as Task);
  }

  // eslint-disable-next-line require-jsdoc
  async create(task: Task): Promise<string> {
    if (!task.createdAt) task.createdAt = new Date();
    const ref = await taskCollection.add(task);
    return ref.id;
  }

  // eslint-disable-next-line require-jsdoc
  async update(id: string, task: Partial<Task>): Promise<void> {
    await taskCollection.doc(id).update(task);
  }

  // eslint-disable-next-line require-jsdoc
  async delete(id: string): Promise<void> {
    await taskCollection.doc(id).delete();
  }

  // eslint-disable-next-line require-jsdoc
  async markAsCompleted(id: string): Promise<void> {
    await taskCollection.doc(id).update({completed: true});
  }
}
