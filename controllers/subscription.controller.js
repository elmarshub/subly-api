import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscriptions.model.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.userId) {
      const error = new Error("You are not the owner of this subscription");
      error.statusCode = 401;
      throw error;
    }

    const subscription = await Subscription.findOne({ user: req.user.id });

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      const error = new Error("Subscription ID is required");
      error.statusCode = 400;
      throw error;
    }

    const subscription = await Subscription.findById(req.params.id);

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
