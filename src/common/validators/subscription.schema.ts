import { z } from "zod";
import { SUBSCRIPTION_CATEGORIES } from "../../database/models/subscription.model.js";

const dateField = z.iso.date().transform((value) => new Date(value));

const subscriptionFields = {
  name: z.string().trim().min(2).max(100),
  price: z.number().min(0),
  currency: z.enum(["USD", "EUR", "GBP", "UAH"]),
  billing: z.enum(["Monthly", "Yearly"]),
  category: z.enum(SUBSCRIPTION_CATEGORIES),
  paymentMethod: z.string().trim(),
  status: z.enum(["active", "paused", "cancelled"]),
  startDate: dateField,
  renewalDate: dateField,
};

export const createSubscriptionSchema = z.object({
  name: subscriptionFields.name,
  price: subscriptionFields.price,
  currency: subscriptionFields.currency.optional(),
  billing: subscriptionFields.billing.optional(),
  category: subscriptionFields.category.optional(),
  paymentMethod: subscriptionFields.paymentMethod.optional(),
  startDate: subscriptionFields.startDate,
  renewalDate: subscriptionFields.renewalDate.optional(),
});

export const updateSubscriptionSchema = z
  .object({
    name: subscriptionFields.name,
    price: subscriptionFields.price,
    currency: subscriptionFields.currency,
    billing: subscriptionFields.billing,
    category: subscriptionFields.category,
    paymentMethod: subscriptionFields.paymentMethod,
    status: subscriptionFields.status,
    startDate: subscriptionFields.startDate,
    renewalDate: subscriptionFields.renewalDate,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
