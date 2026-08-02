import type { SubscriptionDocument } from "../../database/models/subscription.model.js";

export function toSubscriptionDto(doc: SubscriptionDocument) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
    currency: doc.currency,
    billing: doc.billing,
    category: doc.category,
    paymentMethod: doc.paymentMethod,
    status: doc.status,
    startDate: doc.startDate,
    renewalDate: doc.renewalDate,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export type SubscriptionDto = ReturnType<typeof toSubscriptionDto>;
