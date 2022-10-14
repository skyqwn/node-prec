import express from "express";
import multer from "multer";

import {
  memory,
  memoryUpload,
  memoryUploadPost,
} from "../controllers/memoryController.js";

const upload = multer({ dest: "uploads/" });

const memoryRouter = express.Router();

memoryRouter.get("/", memory);

memoryRouter.get("/upload", memoryUpload);

memoryRouter.post("/upload", upload.single("file"), memoryUploadPost);
export default memoryRouter;
