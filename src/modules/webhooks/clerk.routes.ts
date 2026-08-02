import { Router, raw } from "express";
import { handleClerkWebhook } from "./clerk.controller.js";

const webhookRoutes = Router();

webhookRoutes.post(
  "/clerk",
  raw({ type: "application/json" }),
  handleClerkWebhook,
);

export default webhookRoutes;
