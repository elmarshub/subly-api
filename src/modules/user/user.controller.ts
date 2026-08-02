import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/utils/AppError.js";
import { HTTPSTATUS } from "../../config/http.config.js";
import { userService } from "./user.module.js";
import { toUserDto } from "../../common/interfaces/user.dto.js";

export class UserController {
  getUsers = asyncHandler(async (_req: Request, res: Response) => {
    const users = await userService.findAll();
    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: users.map(toUserDto) });
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(
      req.params.id as string,
      req.userId!,
    );

    if (!user) {
      throw new AppError("User not found", HTTPSTATUS.NOT_FOUND);
    }

    res.status(HTTPSTATUS.OK).json({ success: true, data: toUserDto(user) });
  });
}
