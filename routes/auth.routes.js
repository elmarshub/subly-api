import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

// POST api/v1/auth/sign-up
authRouter.post("/sign-up", signUp);

// POST api/v1/auth/sign-in
authRouter.post("/sign-in", signIn);

// POST api/v1/auth/sign-out
authRouter.post("/sign-out", signOut);

export default authRouter;
