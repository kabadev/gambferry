import mongoose, { Schema, Document } from "mongoose";

const PaymentSchema = new Schema(
  {
    userId: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking" },
    orderItems: [],
    amount: { type: Number, required: true },
    currency: { type: String, default: "GMD" },
    method: {
      type: String,
      //   enum: ["card", "cash", "wallet"],
      // required: true,
      default: "cash",
    },
    status: {
      type: String,
      enum: [
        "requires_payment_method",
        "pending",
        "successful",
        "failed",
        "cancelled",
      ],
      default: "pending",
    },
    intentData: {},
    intentId: { type: String },
    payment_link: { type: String },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
