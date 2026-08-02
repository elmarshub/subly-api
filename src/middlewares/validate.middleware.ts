import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { AppError } from "../common/utils/AppError.js";
import { ErrorCode } from "../common/enums/error-code.enum.js";
import { HTTPSTATUS } from "../config/http.config.js";

const formatZodError = (error: z.ZodError) =>
  error.issues
    .map((issue) =>
      issue.path.length
        ? `${issue.path.join(".")}: ${issue.message}`
        : issue.message,
    )
    .join(", ");

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          formatZodError(result.error),
          HTTPSTATUS.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR,
        ),
      );
    }

    req.body = result.data;
    next();
  };

export const validateParams =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return next(
        new AppError(
          formatZodError(result.error),
          HTTPSTATUS.BAD_REQUEST,
          ErrorCode.VALIDATION_ERROR,
        ),
      );
    }

    next();
  };
