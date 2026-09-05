import mongoose, { Schema, models, model } from "mongoose";
import { extraCategories } from "@/lib/constants";

const ExtraItemSchema = new Schema(
  {
    category: { type: String, enum: extraCategories, required: true, index: true },
    description: { type: String, required: true, unique: true },
    defaultPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default models.ExtraItem || model("ExtraItem", ExtraItemSchema);
