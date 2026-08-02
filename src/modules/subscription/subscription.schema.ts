import { z } from "zod";
import { SUBSCRIPTION_CATEGORIES } from "../../database/models/subscription.model.js";

const dateField = z.preprocess(
  (value) =>
    value === undefined || value === null ? value : new Date(value as string),
  z.date(),
);

export const createSubscriptionSchema = z.object({
  name: z.string().trim().min(2).max(100),
  price: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP", "UAH"]).optional(),
  billing: z.enum(["Monthly", "Yearly"]).optional(),
  category: z.enum(SUBSCRIPTION_CATEGORIES).optional(),
  paymentMethod: z.string().trim().optional(),
  startDate: dateField,
  renewalDate: dateField.optional(),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
