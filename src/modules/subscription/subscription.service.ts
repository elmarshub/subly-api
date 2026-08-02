import SubscriptionModel from "../../database/models/subscription.model.js";

const EDITABLE_FIELDS = [
  "name",
  "price",
  "currency",
  "billing",
  "category",
  "paymentMethod",
  "status",
  "startDate",
  "renewalDate",
] as const;

export class SubscriptionService {
  async create(userId: string, data: Record<string, unknown>) {
    return SubscriptionModel.create({ ...data, userId });
  }

  async findAllForUser(userId: string) {
    return SubscriptionModel.find({ userId }).sort({ renewalDate: 1 });
  }

  async findByIdForUser(id: string, userId: string) {
    return SubscriptionModel.findOne({ _id: id, userId });
  }

  async updateForUser(
    id: string,
    userId: string,
    data: Record<string, unknown>,
  ) {
    const update: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (data[field] !== undefined) update[field] = data[field];
    }

    return SubscriptionModel.findOneAndUpdate({ _id: id, userId }, update, {
      new: true,
      runValidators: true,
    });
  }

  async setWorkflowRunId(id: string, workflowRunId: string) {
    return SubscriptionModel.findByIdAndUpdate(
      id,
      { workflowRunId },
      { new: true },
    );
  }

  async cancelForUser(id: string, userId: string) {
    return this.updateForUser(id, userId, { status: "cancelled" });
  }

  async deleteForUser(id: string, userId: string) {
    return SubscriptionModel.findOneAndDelete({ _id: id, userId });
  }

  async findUpcomingForUser(userId: string, days = 30) {
    const now = new Date();
    const until = new Date();
    until.setDate(until.getDate() + days);

    return SubscriptionModel.find({
      userId,
      status: "active",
      renewalDate: { $gte: now, $lte: until },
    }).sort({ renewalDate: 1 });
  }
}
