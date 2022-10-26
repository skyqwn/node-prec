import express from "express";
import { isCreator, isVerifiedEmail, upload } from "../middleware.js";

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

memoryRouter.get("/", isVerifiedEmail, memory);

memoryRouter.get("/upload", isVerifiedEmail, memoryUpload);

memoryRouter.post(
  "/upload",
  isVerifiedEmail,
  upload.single("file"),
  memoryUploadPost
);

memoryRouter.get("/:id", isVerifiedEmail, detail);

memoryRouter.get("/:id/update", isVerifiedEmail, isCreator, memoryUpdate);
memoryRouter.post(
  "/:id/update",
  isVerifiedEmail,
  isCreator,
  upload.single("file"),
  memoryUpdatePost
);

memoryRouter.get("/:id/delete", isVerifiedEmail, isCreator, memoryRemove);
export default memoryRouter;
