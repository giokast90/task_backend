import {TaskController} from "../task.controller";
import {Request, Response} from "express";

describe("TaskController", () => {
  let controller: TaskController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;

  const mockTaskRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    markAsCompleted: jest.fn(),
  };

  beforeEach(() => {
    controller = new TaskController(mockTaskRepo);
    json = jest.fn();
    status = jest.fn().mockReturnValue({json});
    res = {status, json};
  });

  it("should return all tasks", async () => {
    const mockTasks = [{id: "1", title: "Test", completed: false}];
    jest.spyOn(controller["taskRepo"], "getAll").mockResolvedValue(mockTasks);

    await controller.getAll(req as Request, res as Response);

    expect(json).toHaveBeenCalledWith(mockTasks);
  });

  it("should create a new task", async () => {
    req = {body: {title: "New task"}};
    const spy = jest
      .spyOn(controller["taskRepo"], "create")
      .mockResolvedValue("new_task_id");

    await controller.create(req as Request, res as Response);

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      title: "New task",
      completed: false,
    }));
    expect(status).toHaveBeenCalledWith(201);
  });

  it("should update a task", async () => {
    req = {
      params: {id: "task-1"},
      body: {title: "Updated task"},
    };
    const spy = jest
      .spyOn(controller["taskRepo"], "update")
      .mockResolvedValue();

    await controller.update(req as Request, res as Response);

    expect(spy).toHaveBeenCalledWith("task-1", {title: "Updated task"});
  });

  it("should delete a task", async () => {
    req = {params: {id: "task-1"}};
    const spy = jest
      .spyOn(controller["taskRepo"], "delete")
      .mockResolvedValue();

    res = {
      status: jest.fn().mockReturnValue({send: jest.fn()}),
    };

    await controller.delete(req as Request, res as Response);

    expect(spy).toHaveBeenCalledWith("task-1");
    expect(res.status).toHaveBeenCalledWith(204);
  });

  it("should mark a task as completed", async () => {
    req = {params: {id: "task-1"}};
    const spy = jest
      .spyOn(controller["taskRepo"], "markAsCompleted")
      .mockResolvedValue();

    await controller.markAsCompleted(req as Request, res as Response);

    expect(spy).toHaveBeenCalledWith("task-1");
  });
});
