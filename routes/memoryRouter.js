import express from "express";
import { memory } from "../controllers/memoryController.js";

const memoryRouter = express.Router();

memoryRouter.get("/", memory);

export default memoryRouter;
