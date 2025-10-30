import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    id: { type: String },
    route_name: { type: String, required: true },
    departurePort: { type: String, required: true },
    arrivalPort: { type: String, required: true },
    base_price: { type: Number, required: true },
    duration: { type: String },
    distance_km: { type: Number },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Route =
  mongoose.models.Route || mongoose.model("Route", routeSchema);
