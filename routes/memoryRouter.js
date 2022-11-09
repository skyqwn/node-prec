import express from "express";
import { isCreator, isVerifiedEmail, S3MulterUpload } from "../middleware.js";

import {
  detail,
  memory,
  memoryRemove,
  memoryUpdate,
  memoryUpdatePost,
  memoryUpload,
  memoryUploadPost,
  search,
} from "../controllers/memoryController.js";

const memoryRouter = express.Router();

memoryRouter.get("/", memory);

memoryRouter.get("/search", search);

memoryRouter.get("/upload", memoryUpload);

memoryRouter.post(
  "/upload",

  S3MulterUpload.single("file"),
  memoryUploadPost
);

memoryRouter.get("/:id", detail);

memoryRouter.get("/:id/update", isCreator, memoryUpdate);
memoryRouter.post(
  "/:id/update",

  isCreator,
  S3MulterUpload.single("file"),
  memoryUpdatePost
);

memoryRouter.get("/:id/delete", isCreator, memoryRemove);
export default memoryRouter;
