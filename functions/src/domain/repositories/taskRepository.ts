import {Task} from "../models/task";

export interface TaskRepository {
    getAll(): Promise<Task[]>;
    create(task: Task): Promise<string>;
    update(id: string, task: Partial<Task>): Promise<void>;
    delete(id: string): Promise<void>;
    markAsCompleted(id: string): Promise<void>;
}
