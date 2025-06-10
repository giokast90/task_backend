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
  async getById(id: string): Promise<Task | null> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Task;
  }

  // eslint-disable-next-line require-jsdoc
  async create(task: Task): Promise<string> {
    if (!task.createdAt) task.createdAt = new Date();
    const ref = await taskCollection.add(task);
    return ref.id;
  }

  // eslint-disable-next-line require-jsdoc
  async update(id: string, task: Partial<Task>): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update(task);
  }

  // eslint-disable-next-line require-jsdoc
  async delete(id: string): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.delete();
  }

  // eslint-disable-next-line require-jsdoc
  async markAsCompleted(id: string): Promise<void> {
    const snapshot = await taskCollection.where("id", "==", id)
      .limit(1)
      .get();
    if (snapshot.empty) return;
    await snapshot.docs[0].ref.update({completed: true});
  }
}
