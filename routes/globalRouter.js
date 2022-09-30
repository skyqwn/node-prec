import express from "express";
import { home } from "../controllers/globalController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);

export default globalRouter;
