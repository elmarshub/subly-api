import { Router } from "express";
import { userController } from "./user.module.js";
import { requireClerkAuth } from "../../middlewares/clerkAuth.middleware.js";

const userRoutes = Router();

userRoutes.get("/", requireClerkAuth, userController.getUsers);
userRoutes.get("/:id", requireClerkAuth, userController.getUser);

export default userRoutes;
