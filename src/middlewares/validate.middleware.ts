import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { AppError } from "../common/utils/AppError.js";
import { ErrorCode } from "../common/enums/error-code.enum.js";
import { HTTPSTATUS } from "../config/http.config.js";

export const validate =
  <T>(schema: z.ZodType<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(", ");

      return next(
        new AppError(message, HTTPSTATUS.BAD_REQUEST, ErrorCode.VALIDATION_ERROR),
      );
    }

    req.body = result.data;
    next();
  };
