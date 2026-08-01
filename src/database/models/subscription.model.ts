import mongoose from "mongoose";

export const SUBSCRIPTION_CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
] as const;

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subscription name is required"],
      trim: true,
      minlength: [2, "Subscription name must be at least 2 characters"],
      maxlength: [100, "Subscription name must be less than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Subscription price is required"],
      min: [0, "Subscription price must be greater than 0"],
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP", "UAH"],
      default: "USD",
    },
    billing: {
      type: String,
      enum: ["Monthly", "Yearly"],
      default: "Monthly",
    },
    category: {
      type: String,
      enum: SUBSCRIPTION_CATEGORIES,
      default: "Other",
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "cancelled"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: true,
    },
    renewalDate: {
      type: Date,
    },
    // Clerk user id — not a Mongo ref, since the user's identity lives in Clerk.
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Auto-calculate the renewal date from the billing cycle if it wasn't provided.
subscriptionSchema.pre("save", function () {
  if (!this.renewalDate) {
    const renewal = new Date(this.startDate);

    if (this.billing === "Yearly") {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }

    this.renewalDate = renewal;
  }
});

export type SubscriptionDocument = mongoose.InferSchemaType<
  typeof subscriptionSchema
> &
  mongoose.Document;

const SubscriptionModel = mongoose.model("Subscription", subscriptionSchema);

export default SubscriptionModel;
