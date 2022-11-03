import express from "express";
import { detail } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/:id", detail);

export default userRouter;
