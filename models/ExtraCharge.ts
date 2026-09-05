import mongoose, { Schema, models, model } from "mongoose";
import { extraCategories } from "@/lib/constants";

const ExtraChargeSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    category: { type: String, enum: extraCategories, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    notes: String,
    addedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default models.ExtraCharge || model("ExtraCharge", ExtraChargeSchema);
