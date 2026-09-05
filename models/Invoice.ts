import mongoose, { Schema, models, model } from "mongoose";
import { invoiceStatuses } from "@/lib/constants";

if (process.env.NODE_ENV !== "production" && models.Invoice) {
  mongoose.deleteModel("Invoice");
}

const InvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking", index: true, default: null },
    status: { type: String, enum: invoiceStatuses, default: "Draft", index: true },
    snapshot: { type: Schema.Types.Mixed, required: true },
    discount: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    serviceCharge: { type: Number, default: 0, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    amountPaid: { type: Number, default: 0, min: 0 },
    balanceDue: { type: Number, default: 0, min: 0 },
    paymentMethod: String,
    notes: String,
    finalizedAt: Date,
    reopenedAt: Date
  },
  { timestamps: true }
);

export default models.Invoice || model("Invoice", InvoiceSchema);
