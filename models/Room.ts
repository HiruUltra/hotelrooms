import mongoose, { Schema, models, model } from "mongoose";
import { roomStatuses, roomTypes } from "@/lib/constants";

const RoomSchema = new Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: "text" },
    type: { type: String, enum: roomTypes, required: true, index: true },
    ac: { type: Boolean, default: true, index: true },
    pricePerNight: { type: Number, required: true, min: 0, index: true },
    maxAdults: { type: Number, required: true, min: 1 },
    maxChildren: { type: Number, required: true, min: 0 },
    bedType: { type: String, required: true },
    floorNumber: { type: Number, required: true },
    roomSize: { type: String, required: true },
    description: { type: String, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    status: { type: String, enum: roomStatuses, default: "Available", index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

RoomSchema.index({ roomNumber: "text", name: "text" });
export type RoomDocument = mongoose.InferSchemaType<typeof RoomSchema> & { _id: mongoose.Types.ObjectId };
export default models.Room || model("Room", RoomSchema);
