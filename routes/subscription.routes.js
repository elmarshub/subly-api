import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getSubscriptionById,
  getUserSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.send({ title: "Get all subscriptions" });
});

subscriptionRouter.get("/:id", authorize, getSubscriptionById);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, (req, res) => {
  res.send({ title: "Update subscription" });
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.send({ title: "Delete subscription" });
});

subscriptionRouter.get("/user/:userId", authorize, getUserSubscription);

subscriptionRouter.put("/:id/cancel", (req, res) => {
  res.send({ title: "Cancel subscription" });
});

subscriptionRouter.get("/upcoming-renewals", (req, res) => {
  res.send({ title: "Get upcoming renewals" });
});

export default subscriptionRouter;
