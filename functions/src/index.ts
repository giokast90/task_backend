import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import taskRoutes from "./interfaces/routes/task.routes";
import userRoutes from "./interfaces/routes/user.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/tasks", taskRoutes);
app.use("/users", userRoutes);

export const api = functions.https.onRequest(app);
