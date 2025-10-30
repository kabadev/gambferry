import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    ferry_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ferry",
      required: true,
    },
    route_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
      required: true,
    },
    departureDate: { type: String },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    status: {
      type: String,
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

export const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
