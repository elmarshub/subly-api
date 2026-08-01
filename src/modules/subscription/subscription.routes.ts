import { Router } from "express";
import { subscriptionController } from "./subscription.module.js";
import { requireClerkAuth } from "../../middlewares/clerkAuth.middleware.js";

const subscriptionRoutes = Router();

// every subscription route is scoped to the logged-in Clerk user
subscriptionRoutes.use(requireClerkAuth);

subscriptionRoutes.get("/", subscriptionController.getAllForUser);
subscriptionRoutes.get("/upcoming-renewals", subscriptionController.getUpcoming);
subscriptionRoutes.get("/:id", subscriptionController.getById);
subscriptionRoutes.post("/", subscriptionController.create);
subscriptionRoutes.put("/:id", subscriptionController.update);
subscriptionRoutes.put("/:id/cancel", subscriptionController.cancel);
subscriptionRoutes.delete("/:id", subscriptionController.delete);

export default subscriptionRoutes;
