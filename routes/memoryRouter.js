import express from "express";
import { isCreator, upload } from "../middleware.js";

import {
  detail,
  memory,
  memoryRemove,
  memoryUpdate,
  memoryUpdatePost,
  memoryUpload,
  memoryUploadPost,
} from "../controllers/memoryController.js";

const memoryRouter = express.Router();

memoryRouter.get("/", memory);

memoryRouter.get("/upload", memoryUpload);

memoryRouter.post("/upload", upload.single("file"), memoryUploadPost);

memoryRouter.get("/:id", detail);

memoryRouter.get("/:id/update", isCreator, memoryUpdate);
memoryRouter.post(
  "/:id/update",
  isCreator,
  upload.single("file"),
  memoryUpdatePost
);

memoryRouter.get("/:id/delete", isCreator, memoryRemove);
export default memoryRouter;
