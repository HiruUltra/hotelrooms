import mongoose, { Schema, models, model } from "mongoose";

const RoomBlockSchema = new Schema(
  {
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    startsAt: { type: Date, required: true, index: true },
    endsAt: { type: Date, required: true, index: true },
    reason: { type: String, default: "Maintenance" },
    notes: String
  },
  { timestamps: true }
);

RoomBlockSchema.index({ room: 1, startsAt: 1, endsAt: 1 });
export default models.RoomBlock || model("RoomBlock", RoomBlockSchema);
