import mongoose from "mongoose";

const ferrySchema = new mongoose.Schema(
  {
    id: { type: Number },
    ferry_name: { type: String, required: true },
    ferry_code: { type: String, required: true },
    ferry_type: { type: String, required: true },
    passengers_capacity: { type: Number, default: 0 },
    cattle_capacity: { type: Number, default: 0 },
    rgc_capacity: { type: Number, default: 0 },
    sg_capacity: { type: Number, default: 0 },
    ppcp_capacity: { type: Number, default: 0 },
    description: { type: String },
    ferry_image: { type: String },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Under Maintenance"],
      default: "Active",
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Ferry =
  mongoose.models.Ferry || mongoose.model("Ferry", ferrySchema);
