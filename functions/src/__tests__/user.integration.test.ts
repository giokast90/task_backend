import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import {UserController} from "../interfaces/controllers/user.controller";

jest.mock("firebase-admin", () => {
  const authMock = {
    createCustomToken: jest.fn(
      (uid) => Promise.resolve(`mocked-token-for-${uid}`)
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
    firestore: () => firestoreMock,
    auth: jest.fn(() => authMock),
  };
});

describe("User API integration", () => {
  it("POST /users -> should create new user", async () => {
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(undefined),
    };

    const controller = new UserController(mockUserRepo);
    const app = express();
    app.use(bodyParser.json());
    app.post("/users", (req, res) => controller.create(req, res));

    const res = await request(app)
      .post("/users").send({email: "test@example.com"});

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("test@example.com");
    expect(res.body.id).toBeDefined();

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
    expect(mockUserRepo.create).toHaveBeenCalledWith("test@example.com");
  });
  it("POST /users/login -> should return token for existing user", async () => {
    const email = "existing@example.com";
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue({id: "abc123", email}),
      create: jest.fn().mockResolvedValue(undefined),
    };

    const controller = new UserController(mockUserRepo);
    const app = express();
    app.use(bodyParser.json());
    app.post("/users/login", (req, res) => controller.login(req, res));

    const res = await request(app)
      .post("/users/login")
      .send({email});

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe("mocked-token-for-abc123");
  });
});
