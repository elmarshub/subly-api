import type { Request, Response } from "express";
import { Webhook } from "svix";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/utils/AppError.js";
import { HTTPSTATUS } from "../../config/http.config.js";
import appConfig from "../../config/app.config.js";
import { userService } from "../user/user.module.js";
import { clerkWebhookEventSchema } from "../../common/validators/webhook.schema.js";

export const handleClerkWebhook = asyncHandler(
  async (req: Request, res: Response) => {
    const svixId = req.header("svix-id");
    const svixTimestamp = req.header("svix-timestamp");
    const svixSignature = req.header("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      throw new AppError("Missing svix headers", HTTPSTATUS.BAD_REQUEST);
    }

    const webhook = new Webhook(appConfig.CLERK.WEBHOOK_SIGNING_SECRET);

    let verified: unknown;
    try {
      verified = webhook.verify(req.body as Buffer, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch {
      throw new AppError("Invalid webhook signature", HTTPSTATUS.UNAUTHORIZED);
    }

    const parsed = clerkWebhookEventSchema.safeParse(verified);
    if (!parsed.success) {
      throw new AppError("Invalid webhook payload", HTTPSTATUS.BAD_REQUEST);
    }

    const { type, data } = parsed.data;

    if (type === "user.created" || type === "user.updated") {
      const emailAddresses = data.email_addresses ?? [];
      const email =
        emailAddresses.find((e) => e.id === data.primary_email_address_id)
          ?.email_address ?? emailAddresses[0]?.email_address;

      if (!email) {
        throw new AppError(
          "Clerk user has no email address",
          HTTPSTATUS.BAD_REQUEST,
        );
      }

      const name =
        [data.first_name, data.last_name].filter(Boolean).join(" ") ||
        "Unknown";

      await userService.upsertFromClerk(data.id, name, email);
    } else if (type === "user.deleted") {
      await userService.deleteByClerkId(data.id);
    }

    res.status(HTTPSTATUS.OK).json({ success: true });
  },
);
