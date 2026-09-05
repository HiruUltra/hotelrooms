import { Schema, models, model } from "mongoose";

const CounterSchema = new Schema({
  key: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 }
});

export default models.Counter || model("Counter", CounterSchema);
