import mongoose, { Schema, models, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    booking: { type: Schema.Types.ObjectId, ref: "Booking", required: true, index: true },
    invoice: { type: Schema.Types.ObjectId, ref: "Invoice" },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, default: "Cash" },
    note: String,
    recordedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export default models.Payment || model("Payment", PaymentSchema);
