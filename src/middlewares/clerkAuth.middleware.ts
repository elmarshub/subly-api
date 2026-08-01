import type { NextFunction, Request, Response } from "express";
import { getAuth } from "@clerk/express";
import { AppError } from "../common/utils/AppError.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const requireClerkAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError("Unauthorized", HTTPSTATUS.UNAUTHORIZED);
  }

  req.userId = userId;
  next();
};
