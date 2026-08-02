import UserModel from "../../database/models/user.model.js";

const MAX_USERS_PAGE_SIZE = 50;

export class UserService {
  async findAll() {
    return UserModel.find()
      .select("clerkId name email createdAt")
      .sort({ createdAt: -1 })
      .limit(MAX_USERS_PAGE_SIZE);
  }

  async findById(id: string, requesterClerkId: string) {
    return UserModel.findOne({ _id: id, clerkId: requesterClerkId });
  }

  async upsertFromClerk(clerkId: string, name: string, email: string) {
    const update = { clerkId, name, email };
    const options = {
      upsert: true,
      returnDocument: "after" as const,
      runValidators: true,
    };

    try {
      return await UserModel.findOneAndUpdate({ clerkId }, update, options);
    } catch (error) {
      if ((error as { code?: number }).code === 11000) {
        return UserModel.findOneAndUpdate({ clerkId }, update, options);
      }
      throw error;
    }
  }

  async deleteByClerkId(clerkId: string) {
    return UserModel.findOneAndDelete({ clerkId });
  }
}
