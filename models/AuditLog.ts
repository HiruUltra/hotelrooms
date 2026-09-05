import mongoose, { Schema, models, model } from "mongoose";

const AuditLogSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: "User", index: true },
    action: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, required: true, index: true },
    metadata: Schema.Types.Mixed
  },
  { timestamps: true }
);

export default models.AuditLog || model("AuditLog", AuditLogSchema);
