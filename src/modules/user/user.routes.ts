import { Router } from "express";
import { userController } from "./user.module.js";
import { requireClerkAuth } from "../../middlewares/clerkAuth.middleware.js";
import { validateParams } from "../../middlewares/validate.middleware.js";
import { userIdParamSchema } from "../../common/validators/user.schema.js";

const userRoutes = Router();

userRoutes.get("/", requireClerkAuth, userController.getUsers);
userRoutes.get(
  "/:id",
  requireClerkAuth,
  validateParams(userIdParamSchema),
  userController.getUser,
);

export default userRoutes;
