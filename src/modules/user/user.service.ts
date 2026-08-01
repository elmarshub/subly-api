import UserModel from "../../database/models/user.model.js";

const MAX_USERS_PAGE_SIZE = 50;

export class UserService {
  async findAll() {
    return UserModel.find()
      .select("clerkId name email createdAt")
      .sort({ createdAt: -1 })
      .limit(MAX_USERS_PAGE_SIZE);
  }

  // Scoped to the requesting Clerk user — prevents one account from reading
  // another user's record by guessing/enumerating Mongo _ids.
  async findById(id: string, requesterClerkId: string) {
    return UserModel.findOne({ _id: id, clerkId: requesterClerkId });
  }
}
