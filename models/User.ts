import mongoose, { Schema, models, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
    phone: { type: String, trim: true, index: true },
    address: { type: String, trim: true },
    identityNumber: { type: String, trim: true, index: true },
    image: String
  },
  { timestamps: true }
);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };
export default models.User || model("User", UserSchema);
