import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";

export const userService = new UserService();
export const userController = new UserController();
