/**
 * Integration tests for the Task API.
 * These tests verify the interaction between the TaskController,
 * the repository layer (mocked), and the Express application
 * to handle tasks efficiently.
 */
import request from "supertest";
import {TaskController} from "../interfaces/controllers/task.controller";
import {Task} from "../domain/models/task";
import express from "express";
import bodyParser from "body-parser";

jest.mock("firebase-admin", () => {
  const authMock = {
    verifyIdToken: jest.fn(
      (token) => Promise.resolve({uid: `decoded_token_${token}`})
    ),
  };
  const firestoreMock = {
    collection: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    get: jest.fn(),
    add: jest.fn(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    limit: jest.fn().mockReturnThis(),
  };

  return {
    initializeApp: jest.fn(),
    firestore: jest.fn(() => firestoreMock),
    auth: jest.fn(() => authMock),
  };
});

describe("Task API integration", () => {
  const token = "mocked-token";
  let createdTaskId = "new_task_id";

  /**
   * Integration test for creating a task using POST /tasks endpoint.
   * Verifies that a task is created with the correct properties and
   * a valid response is returned.
   */
  it("POST /tasks -> should create a task", async () => {
    const mockTaskRepo = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn().mockReturnValue(createdTaskId),
      update: jest.fn(),
      delete: jest.fn(),
      markAsCompleted: jest.fn(),
    };
    const controller = new TaskController(mockTaskRepo);
    const app = express();
    app.use(bodyParser.json());
    app.post("/tasks", (req, res)=> controller.create(req, res));
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({title: "Test task", description: "Test description"});

    expect(response.status).toBe(201);
    expect(response.body.id).toEqual(expect.any(String));
    createdTaskId = response.body.id;
  });

  /**
   * Integration test for retrieving all tasks using GET /tasks endpoint.
   * Ensures that the retrieved tasks match the expected criteria,
   * particularly checking for a specific task by ID and its completion status.
   */
  it("GET /tasks -> should retrieve all tasks (completed: true)", async () => {
    const mockTaskRepo = {
      getAll: jest.fn().mockReturnValue([{id: createdTaskId, completed: true}]),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      markAsCompleted: jest.fn(),
    };
    const controller = new TaskController(mockTaskRepo);
    const app = express();
    app.use(bodyParser.json());
    app.get("/tasks",
      (req, res)=> controller.getAll(req, res)
    );
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    const task = response.body.find((t: Task) => t.id === createdTaskId);
    expect(task).toBeDefined();
    expect(task.completed).toBe(true);
  });
});
