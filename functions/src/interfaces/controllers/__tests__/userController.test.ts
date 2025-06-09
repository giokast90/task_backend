import {UserController} from "../user.controller";
import {Request, Response} from "express";

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

describe("UserController", () => {
  let controller: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let json: jest.Mock;
  let status: jest.Mock;
  const mockUserRepo = {
    findByEmail: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(undefined),
  };
  const mockTokenRepo = {
    createAccessToken: jest.fn().mockResolvedValue({id: "123"}),
  };

  beforeEach(() => {
    controller = new UserController(mockUserRepo, mockTokenRepo);
    json = jest.fn();
    status = jest.fn().mockReturnValue({json});
    res = {status, json};
  });

  it("should return 400 if email is missing on login", async () => {
    req = {body: {}};
    await controller.login(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({message: "Email required"});
  });

  it("should return 404 if user not found", async () => {
    req = {body: {email: "notfound@example.com"}};
    jest.spyOn(controller["userRepo"], "findByEmail").mockResolvedValue(null);
    await controller.login(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({message: "User not found"});
  });

  it("should return token if user exists", async () => {
    req = {body: {email: "test@example.com"}};
    jest.spyOn(controller["userRepo"], "findByEmail")
      .mockResolvedValue({id: "abc123", email: "test@example.com"});
    await controller.login(req as Request, res as Response);
    // eslint-disable-next-line max-len
    expect(json).toHaveBeenCalledWith(expect.objectContaining({accessToken: expect.any(String)}));
  });
});
