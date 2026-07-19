import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { getUsers, getUser } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/", getUsers);
userRouter.get("/:id", authorize, getUser);

userRouter.post("/", (req, res) => {
  res.send({ title: "Create a new user" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "Update user by id" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete user by id" });
});

export default userRouter;

// q3M97KwOwNOspMsc
