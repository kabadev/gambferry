import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    booking_reference: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    passenger_name: { type: String, required: true },
    passenger_email: { type: String },
    passenger_phone: { type: String },
    num_passengers: { type: Number, default: 1 },
    passenger_type: {
      type: String,
      enum: ["Economy", "VIP", "Bicycle"],
      default: "Economy",
    },
    departure_date: { type: Date },
    vehicle_type: { type: String },
    vehicle_plate: { type: String },

    livestock: {
      cattle: { type: Number, default: 0 },
      sheep_goats: { type: Number, default: 0 },
    },
    cargo: {
      rice_bags: { type: Number, default: 0 },
      groundnut_bags: { type: Number, default: 0 },
      cement_bags: { type: Number, default: 0 },
      cartons: { type: Number, default: 0 },
    },

    amount: { type: Number, required: true },
    currency: { type: String, default: "GMD" },
    payment_method: {
      type: String,
      enum: ["Mobile Money", "Wave", "Cash", "Card"],
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    booking_status: {
      type: String,
      enum: ["Confirmed", "Cancelled", "Completed", "Pending"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },

    // Relationships (references)
    ferry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ferry",
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route",
    },
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Schedule",
    },
  },
  { timestamps: true }
);

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
