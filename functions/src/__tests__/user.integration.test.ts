/**
 * @file Integration tests for the User API.
 * This file contains tests for the following endpoints:
 * - POST /users: Handles the creation of new users and token generation.
 * - POST /users/login: Handles user login and returns a valid access token.
 */
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
  /**
   * Test for the POST /users endpoint.
   * This test verifies the functionality of creating a new user
   * and receiving an access token upon successful creation.
   */
  it("POST /users -> should create new user", async () => {
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(undefined),
    };
    const mockTokenRepo = {
      createAccessToken: jest.fn().mockResolvedValue({id: "123"}),
      validToken: jest.fn().mockResolvedValue(true),
    };

    const controller = new UserController(mockUserRepo, mockTokenRepo);
    const app = express();
    app.use(bodyParser.json());
    app.post("/users", (req, res) => controller.create(req, res));

    const res = await request(app)
      .post("/users").send({email: "test@example.com"});

    expect(res.status).toBe(201);
    // eslint-disable-next-line max-len
    expect(res.body).toEqual(expect.objectContaining({accessToken: expect.any(String)}));

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith("test@example.com");
    // eslint-disable-next-line max-len
    expect(mockUserRepo.create).toHaveBeenCalledWith({email: "test@example.com", id: expect.any(String)});
  });
  /**
   * Test for the POST /users/login endpoint.
   * Ensures that an existing user can successfully log in
   * and receive a valid access token in the response.
   */
  it("POST /users/login -> should return token for existing user", async () => {
    const email = "existing@example.com";
    const mockUserRepo = {
      findByEmail: jest.fn().mockResolvedValue({id: "abc123", email}),
      create: jest.fn().mockResolvedValue(undefined),
    };
    const mockTokenRepo = {
      createAccessToken: jest.fn().mockResolvedValue({id: "123"}),
      validToken: jest.fn().mockResolvedValue(true),
    };

    const controller = new UserController(mockUserRepo, mockTokenRepo);
    const app = express();
    app.use(bodyParser.json());
    app.post("/users/login", (req, res) => controller.login(req, res));

    const res = await request(app)
      .post("/users/login")
      .send({email});

    expect(res.status).toBe(200);
    // eslint-disable-next-line max-len
    expect(res.body).toEqual(expect.objectContaining({accessToken: expect.any(String)}));
  });
});
