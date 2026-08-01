import { SubscriptionService } from "./subscription.service.js";
import { SubscriptionController } from "./subscription.controller.js";

export const subscriptionService = new SubscriptionService();
export const subscriptionController = new SubscriptionController();
