import type { Request, Response } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/utils/AppError.js";
import { HTTPSTATUS } from "../../config/http.config.js";
import { subscriptionService } from "./subscription.module.js";
import { workflowService } from "../workflow/workflow.module.js";
import { toSubscriptionDto } from "./subscription.dto.js";

export class SubscriptionController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.create(
      req.userId!,
      req.body,
    );

    let workflowRunId: string | undefined;
    try {
      workflowRunId = await workflowService.triggerReminder(subscription.id);
      await subscriptionService.setWorkflowRunId(
        subscription.id,
        workflowRunId,
      );
    } catch (error) {
      console.error(
        `Failed to schedule reminder workflow for subscription ${subscription.id}`,
        error,
      );
    }

    res
      .status(HTTPSTATUS.CREATED)
      .json({ success: true, data: toSubscriptionDto(subscription) });
  });

  getAllForUser = asyncHandler(async (req: Request, res: Response) => {
    const subscriptions = await subscriptionService.findAllForUser(req.userId!);
    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: subscriptions.map(toSubscriptionDto) });
  });

  getUpcoming = asyncHandler(async (req: Request, res: Response) => {
    const days = req.query.days ? Number(req.query.days) : 30;
    const subscriptions = await subscriptionService.findUpcomingForUser(
      req.userId!,
      days,
    );
    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: subscriptions.map(toSubscriptionDto) });
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.findByIdForUser(
      req.params.id as string,
      req.userId!,
    );

    if (!subscription) {
      throw new AppError("Subscription not found", HTTPSTATUS.NOT_FOUND);
    }

    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: toSubscriptionDto(subscription) });
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const existing = await subscriptionService.findByIdForUser(
      req.params.id as string,
      req.userId!,
    );

    if (!existing) {
      throw new AppError("Subscription not found", HTTPSTATUS.NOT_FOUND);
    }

    const subscription = await subscriptionService.updateForUser(
      req.params.id as string,
      req.userId!,
      req.body,
    );

    if (!subscription) {
      throw new AppError("Subscription not found", HTTPSTATUS.NOT_FOUND);
    }

    const renewalDateChanged =
      subscription.renewalDate?.getTime() !== existing.renewalDate?.getTime();

    if (renewalDateChanged) {
      try {
        if (existing.workflowRunId) {
          await workflowService.cancelReminder(existing.workflowRunId);
        }
        const workflowRunId = await workflowService.triggerReminder(
          subscription.id,
        );
        await subscriptionService.setWorkflowRunId(
          subscription.id,
          workflowRunId,
        );
      } catch (error) {
        console.error(
          `Failed to reschedule reminder workflow for subscription ${subscription.id}`,
          error,
        );
      }
    }

    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: toSubscriptionDto(subscription) });
  });

  cancel = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.cancelForUser(
      req.params.id as string,
      req.userId!,
    );

    if (!subscription) {
      throw new AppError("Subscription not found", HTTPSTATUS.NOT_FOUND);
    }

    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: toSubscriptionDto(subscription) });
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const subscription = await subscriptionService.deleteForUser(
      req.params.id as string,
      req.userId!,
    );

    if (!subscription) {
      throw new AppError("Subscription not found", HTTPSTATUS.NOT_FOUND);
    }

    res
      .status(HTTPSTATUS.OK)
      .json({ success: true, data: toSubscriptionDto(subscription) });
  });
}
