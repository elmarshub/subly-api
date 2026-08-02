import type { UserDocument } from "../../database/models/user.model.js";

export function toUserDto(doc: UserDocument) {
  return {
    id: doc._id.toString(),
    clerkId: doc.clerkId,
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export type UserDto = ReturnType<typeof toUserDto>;
