import UserModel from "../../database/models/user.model.js";

export class UserService {
  async findAll() {
    return UserModel.find();
  }

  async findById(id: string) {
    return UserModel.findById(id);
  }
}
