import mongoose from "mongoose";

// Identity (password, sign-in, sessions) lives in Clerk. This table just
// mirrors the bits of a Clerk user we need to join against locally.
const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export type UserDocument = mongoose.InferSchemaType<typeof userSchema> &
  mongoose.Document;

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
