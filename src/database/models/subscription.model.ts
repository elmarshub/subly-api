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
      min: [0, "Subscription price must be at least 0"],
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
    userId: {
      type: String,
      required: true,
      index: true,
    },

    workflowRunId: {
      type: String,
    },
  },
  { timestamps: true },
);

function addMonthsClamped(date: Date, months: number): Date {
  const day = date.getDate();
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const lastDayOfTargetMonth = new Date(
    result.getFullYear(),
    result.getMonth() + 1,
    0,
  ).getDate();
  result.setDate(Math.min(day, lastDayOfTargetMonth));

  return result;
}

// auto-calculate the renewal date from the billing cycle if it wasn't provided.
subscriptionSchema.pre("save", function () {
  if (!this.renewalDate) {
    this.renewalDate = addMonthsClamped(
      this.startDate,
      this.billing === "Yearly" ? 12 : 1,
    );
  }
});

export type SubscriptionDocument = mongoose.InferSchemaType<
  typeof subscriptionSchema
> &
  mongoose.Document;

const SubscriptionModel =
  (mongoose.models.Subscription as mongoose.Model<SubscriptionDocument>) ??
  mongoose.model("Subscription", subscriptionSchema);

export default SubscriptionModel;
