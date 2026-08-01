import type { ErrorRequestHandler } from "express";
import { HTTPSTATUS } from "../config/http.config.js";
import { AppError } from "../common/utils/AppError.js";

export const errorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  console.error(`Error occurred on PATH: ${req.path}`, err);

  if (err.name === "CastError") {
    return res.status(HTTPSTATUS.NOT_FOUND).json({
      success: false,
      message: "Resource not found",
    });
  }

  if (err.code === 11000) {
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(
      err.errors as Record<string, { message: string }>,
    )
      .map((val) => val.message)
      .join(", ");

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
      success: false,
      message,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.errorCode,
    });
  }

  return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err?.message || "Server error",
  });
};

export default errorHandler;
