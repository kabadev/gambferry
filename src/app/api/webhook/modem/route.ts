// app/api/webhooks/modempay/route.ts
import { connectDB } from "@/lib/mongoDB";
import { Booking } from "@/models/Booking";
import Payment from "@/models/Payment";
import ModemPay from "modem-pay";
import { NextRequest, NextResponse } from "next/server";

const modempayWebhook = new ModemPay(process.env.MODEMPAY_WEBHOOK_SECRET!);

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const payload = await req.json();
    const signature = req.headers.get("x-modem-signature");
    const secret = process.env.MODEMPAY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("MODEMPAY_WEBHOOK_SECRET not set");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let modemEvent;
    try {
      modemEvent = modempayWebhook.webhooks.composeEventDetails(
        payload,
        signature,
        secret
      );
    } catch (err) {
      console.error("Invalid webhook signature:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const intentId = payload?.payload?.payment_intent_id;

    if (!intentId) {
      console.error("Missing payment_intent_id in webhook payload");
      return NextResponse.json(
        { error: "Missing payment_intent_id" },
        { status: 400 }
      );
    }

    // Find payment by intentId
    const payment = await Payment.findOne({ intentId });

    if (!payment) {
      console.error("Payment not found for intent:", intentId);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Find booking by bookingId
    const booking = await Booking.findById(payment.bookingId);

    if (!booking) {
      console.error("Booking not found for payment:", payment.bookingId);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Handle different webhook events
    switch (modemEvent.event) {
      case "charge.succeeded":
        // Check if already processed
        if (
          payment.status === "successful" &&
          booking.payment_status === "Confirmed"
        ) {
          console.log("Payment already processed:", intentId);
          return NextResponse.json(
            { message: "Payment already processed" },
            { status: 200 }
          );
        }

        try {
          // Update payment
          payment.status = "successful";
          payment.paidAt = new Date();
          await payment.save();

          // Update booking
          booking.payment_status = "Paid";
          booking.booking_status = "Confirmed";
          await booking.save();

          console.log(
            `✅ Payment successful for booking: ${booking.booking_reference}`
          );

          return NextResponse.json(
            {
              message: "Payment processed successfully",
              bookingReference: booking.booking_reference,
              amount: payment.amount,
            },
            { status: 200 }
          );
        } catch (processError) {
          console.error("Error processing payment:", processError);

          // Rollback
          payment.status = "failed";
          payment.failureReason = (processError as Error).message;
          await payment.save();

          booking.payment_status = "Failed";
          await booking.save();

          return NextResponse.json(
            {
              error: `Transaction failed: ${(processError as Error).message}`,
            },
            { status: 500 }
          );
        }

      case "charge.failed":
        payment.status = "failed";
        payment.failureReason =
          payload?.payload?.failure_message || "Payment failed";
        await payment.save();

        booking.payment_status = "Failed";
        await booking.save();

        console.log(
          `❌ Payment failed for booking: ${booking.booking_reference}`
        );

        return NextResponse.json(
          { message: "Payment failure recorded" },
          { status: 200 }
        );

      case "charge.cancelled":
        payment.status = "cancelled";
        await payment.save();

        booking.payment_status = "Failed";
        await booking.save();

        console.log(
          `🚫 Payment cancelled for booking: ${booking.booking_reference}`
        );

        return NextResponse.json(
          { message: "Payment cancellation recorded" },
          { status: 200 }
        );

      default:
        console.log(
          `Webhook event received but not handled: ${modemEvent.event}`
        );
        return NextResponse.json(
          {
            message: "Webhook received but not handled",
            event: modemEvent.event,
          },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
