"use server";
import { connectDB } from "@/lib/mongoDB";
import { Booking } from "@/models/Booking";
import Payment from "@/models/Payment";
import ModemPay from "modem-pay";
import Stripe from "stripe";

const modempayWebhook = new ModemPay(process.env.MODEMPAY_WEBHOOK_SECRET!);
const modempay = new ModemPay(process.env.MODEMPAY_API_KEY!);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const url = process.env.BASE_URL || "http://localhost:3000/";
// Moderm pay create payment intent
// export const createPayment = async (paymentData: any) => {
//   try {
//     await connectDB();
//     const { userId, bookingId, amount, method, currency } = paymentData;
//     if (!userId || !bookingId || !amount || !method) {
//       throw new Error("Missing bookingId, userId, amount, or method");
//     }
//     if (amount < 10) {
//       throw new Error("Minimum payment is D 10");
//     }

//     const booking = await Booking.findById(bookingId);
//     if (!booking) {
//       throw new Error("Booking Not found");
//     }
//     //find existing pending payment for this ride and user
//     const existingPayment = await Payment.findOne({
//       bookingId,
//       userId,
//       status: "pending",
//     });
//     if (existingPayment) {
//       return {
//         success: true,
//         message: "Payment already in progress",
//         paymentId: existingPayment._id,
//         payment_link: existingPayment.payment_link,
//       };
//     }

//     // Make sure to use your ModemPay instance, not the class directly
//     const intent = await modempay.paymentIntents.create({
//       amount: parseInt(amount),
//       currency: currency,
//       metadata: { userId, bookingId },
//       return_url: `${url}/booking/success?ref=${bookingId}`,
//       cancel_url: `${url}/booking/cancel?ref=${bookingId}`,
//     });

//     if (!intent.status) {
//       return {
//         message: "Error creating payment intent",
//         success: false,
//       };
//     }

//     const payment = await Payment.create({
//       userId,
//       bookingId,
//       amount,
//       method,
//       currency: currency,
//       intentId: intent.data.id,
//       intentData: intent.data,
//       payment_link: intent.data.payment_link,
//       return_url: `${url}/my-tickets`,
//       cancel_url: `${url}/booking/cancel?ref=${bookingId}`,
//     });

//     return JSON.parse(
//       JSON.stringify({
//         success: true,
//         message: "Payment intent created successfully",
//         clientSecret: intent.data.intent_secret,
//         paymentId: payment._id,
//         payment_link: intent.data.payment_link,
//         amount: intent.data.amount,
//         return_url: payment.return_url,
//         cancel_url: payment.cancel_url,
//       })
//     );
//   } catch (error: any) {
//     console.error("Intent creation failed:", error);
//     return {
//       error: error.message,
//       message: "Error creating payment intent",
//       success: false,
//     };
//   }
// };

export const createPayment = async (paymentData: any) => {
  try {
    await connectDB();

    const { userId, bookingId, amount, method, currency = "GMD" } = paymentData;

    // Validation
    if (!userId || !bookingId || !amount || !method) {
      return {
        success: false,
        error: "Missing required fields: userId, bookingId, amount, or method",
      };
    }

    if (amount < 10) {
      return {
        success: false,
        error: "Minimum payment is D 10",
      };
    }

    // Find booking by _id
    const booking = await Booking.findById(bookingId)
      .populate("route")
      .populate("schedule");

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Check if booking is already paid
    if (booking.payment_status === "Confirmed") {
      return {
        success: false,
        error: "This booking has already been paid",
      };
    }

    // Find existing pending payment for this booking and user
    const existingPayment = await Payment.findOne({
      bookingId,
      userId,
      status: "pending",
    });

    if (existingPayment) {
      return {
        success: true,
        message: "Payment already in progress",
        paymentId: existingPayment._id.toString(),
        payment_link: existingPayment.payment_link,
        intentId: existingPayment.intentId,
      };
    }

    // Create payment intent with ModemPay

    const intent: any = await modempay.paymentIntents.create({
      amount: parseInt(amount),
      currency: currency,
      metadata: { userId, bookingId },
      return_url: paymentData.terminal
        ? `${url}/terminal/bookings/success?ref=${bookingId}`
        : `${url}/booking/success?ref=${bookingId}`,
      cancel_url: paymentData.terminal
        ? `${url}/terminal/bookings/cancel?ref=${bookingId}`
        : `${url}/booking/cancel?ref=${bookingId}`,
    });

    // if (!intent || !intent.data || !intent.data.id) {
    //   return {
    //     success: false,
    //     error: "Error creating payment intent with ModemPay",
    //   };
    // }

    if (!intent.status) {
      return {
        message: "Error creating payment intent",
        success: false,
      };
    }

    // console.log("intent:", intent);
    // Create payment record
    const payment = await Payment.create({
      userId,
      bookingId,
      amount,
      method,
      currency,
      intentId: intent.data.payment_intent_id,
      intentData: intent.data,
      payment_link: intent.data.payment_link,
      status: "pending",
      metadata: {
        passenger_name: booking.passenger_name,
        passenger_email: booking.passenger_email,
        route_name: booking.route?.route_name,
        departure_date: booking.schedule?.departureDate,
      },
    });
    if (!payment) {
      console.error("Payment creation failed");
      return {
        success: false,
        error: "Error creating payment record",
      };
    }
    // console.log("payment:", payment);

    return {
      success: true,
      message: "Payment intent created successfully",
      paymentId: payment._id.toString(),
      intentId: intent.data.payment_intent_id,
      clientSecret: intent.data.intent_secret,
      payment_link: intent.data.payment_link,
      amount: intent.data.amount / 100, // Convert back to main currency unit
      currency: intent.data.currency.toUpperCase(),
      bookingReference: booking.booking_reference,
      return_url: `${url}/booking/success?ref=${bookingId}`,
      cancel_url: `${url}/booking/cancel?ref=${bookingId}`,
    };
  } catch (error: any) {
    console.error("Payment creation failed:", error);
    return {
      success: false,
      error: error.message || "Error creating payment intent",
    };
  }
};

export const createCashPayment = async (paymentData: any) => {
  try {
    await connectDB();

    const { userId, bookingId, amount, method, currency = "GMD" } = paymentData;

    // Validation
    if (!userId || !bookingId || !amount || !method) {
      return {
        success: false,
        error: "Missing required fields: userId, bookingId, amount, or method",
      };
    }

    if (amount < 10) {
      return {
        success: false,
        error: "Minimum payment is D 10",
      };
    }

    // Find booking by _id
    const booking = await Booking.findById(bookingId)
      .populate("route")
      .populate("schedule");

    if (!booking) {
      return {
        success: false,
        error: "Booking not found",
      };
    }

    // Check if booking is already paid
    if (booking.payment_status === "Confirmed") {
      return {
        success: false,
        error: "This booking has already been paid",
      };
    }

    // Create payment intent with ModemPay

    // Create payment record
    const payment = await Payment.create({
      userId,
      bookingId,
      amount,
      method: "Cash",
      currency,
      status: "successful",
      paidAt: new Date(),
      metadata: {
        passenger_name: booking.passenger_name,
        passenger_email: booking.passenger_email,
        route_name: booking.route?.route_name,
        departure_date: booking.schedule?.departureDate,
      },
    });
    if (!payment) {
      console.error("Payment creation failed");
      return {
        success: false,
        error: "Error creating payment record",
      };
    }
    // console.log("payment:", payment);

    // Update booking
    booking.payment_status = "Paid";
    booking.booking_status = "Confirmed";
    await booking.save();

    return {
      success: true,
      message: "Payment intent created successfully",
      paymentId: payment._id.toString(),
      payment_link: "",
      bookingReference: booking.booking_reference,
    };
  } catch (error: any) {
    console.error("Payment creation failed:", error);
    return {
      success: false,
      error: error.message || "Error creating payment intent",
    };
  }
};

export const getPaymentByBooking = async (bookingId: string) => {
  try {
    await connectDB();

    const payment = await Payment.findOne({ bookingId })
      .sort({ createdAt: -1 })
      .lean();

    if (!payment) {
      return {
        success: false,
        error: "Payment not found",
      };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(payment)),
    };
  } catch (error) {
    console.error("Get payment error:", error);
    return {
      success: false,
      error: "Failed to fetch payment",
    };
  }
};

export const verifyPayment = async (intentId: string) => {
  try {
    await connectDB();

    const payment = await Payment.findOne({ intentId });

    if (!payment) {
      return {
        success: false,
        error: "Payment not found",
      };
    }

    // Verify with ModemPay
    const intent = await modempay.paymentIntents.retrieve(intentId);

    if (intent.status === "successful" && payment.status !== "successful") {
      // Update payment status
      payment.status = "successful";
      payment.paidAt = new Date();
      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(payment.bookingId, {
        payment_status: "Paid",
        booking_status: "Confirmed",
      });
    }

    return {
      success: true,
      data: {
        status: payment.status,
        modemPayStatus: intent.status,
        paidAt: payment.paidAt,
        amount: payment.amount,
      },
    };
  } catch (error) {
    console.error("Verify payment error:", error);
    return {
      success: false,
      error: "Failed to verify payment",
    };
  }
};

export const cancelPayment = async (intentId: string) => {
  try {
    await connectDB();

    const payment = await Payment.findOne({ intentId });

    if (!payment) {
      return {
        success: false,
        error: "Payment not found",
      };
    }

    if (payment.status === "successful") {
      return {
        success: false,
        error: "Cannot cancel a successful payment",
      };
    }

    // Cancel with ModemPay
    await modempay.paymentIntents.cancel(intentId);

    // Update payment status
    payment.status = "cancelled";
    await payment.save();

    // Update booking
    await Booking.findByIdAndUpdate(payment.bookingId, {
      payment_status: "Failed",
    });

    return {
      success: true,
      message: "Payment cancelled successfully",
    };
  } catch (error) {
    console.error("Cancel payment error:", error);
    return {
      success: false,
      error: "Failed to cancel payment",
    };
  }
};

// moderm pay webhook handler
// export const paymentCallback = async (req, res) => {
//   try {
//     const payload = req.body;
//     const signature = req.headers["x-modem-signature"];
//     const secret = process.env.MODEMPAY_WEBHOOK_SECRET;

//     if (!secret) {
//       console.error("MODEMPAY_WEBHOOK_SECRET not set");
//       return res.status(500).json({ error: "Server misconfiguration" });
//     }

//     if (!signature) {
//       return res.status(400).json({ error: "Missing signature" });
//     }

//     let modemEvent;
//     try {
//       modemEvent = modempayWebhook.webhooks.composeEventDetails(
//         payload,
//         signature,
//         secret
//       );
//     } catch (err) {
//       console.error("Invalid webhook signature:", err);
//       return res.status(400).json({ error: "Invalid signature" });
//     }

//     if (modemEvent.event !== "charge.succeeded") {
//       return res.status(200).json({
//         message: "Webhook received but ignored",
//         event: modemEvent.event,
//       });
//     }

//     const payment = await Payment.findOne({
//       intentId: payload?.payload?.payment_intent_id,
//     });

//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     try {
//       const fare = Number(payment.amount) || 0;
//       const driverAmount = fare * 0.75;
//       const serviceFee = fare * 0.25;
//       // Update payment first
//       payment.status = "successful";
//       payment.paidAt = new Date();
//       payment.driverAmount = driverAmount;
//       payment.serviceFee = serviceFee;
//       await payment.save();

//       // Update ride

//       const ride = await Ride.findByIdAndUpdate(
//         payment.rideId,
//         { paidStatus: "paid" },
//         { new: true }
//       );

//       if (!ride) {
//         throw new Error("Associated ride not found");
//       }

//       // Update user balance

//       const rider = await User.findByIdAndUpdate(ride.rider, {
//         $inc: { balance: Number(driverAmount) },
//       });

//       const user = await User.findById(payment.userId);
//       await sendNotification(
//         `You received a payment of ${payment.amount}`,
//         `You received a payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         "payment",
//         [rider._id]
//       );
//       sendPushNotificationAsync(
//         [rider.expoPushToken],
//         `You received a payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         {
//           type: "RIDE_PAYMENT",
//           // ride: updatedRide,
//         },
//         `You received a payment of ${payment.amount}`
//       );

//       sendPushNotificationAsync(
//         [user.expoPushToken],
//         `Your payment of ${payment.amount} was successfull`,
//         {
//           type: "RIDE_PAYMENT",
//           // ride: updatedRide,
//         },
//         "Your Payment was successfull"
//       );

//       return res
//         .status(200)
//         .json({ message: "Payment processed successfully" });
//     } catch (processError) {
//       console.error("Error processing payment:", processError);

//       // Rollback payment status
//       payment.status = "failed";
//       await payment.save();

//       return res
//         .status(500)
//         .json({ error: `Transaction failed: ${processError.message}` });
//     }
//   } catch (error) {
//     console.error("Webhook handler error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Stripe integration
// export const createCheckoutSession = async (req, res) => {
//   try {
//     const { userId, rideId, amount } = req.body;

//     if (!userId || !rideId || !amount) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     if (amount < 10) {
//       return res.status(400).json({ error: "Minimum payment is D 10" });
//     }

//     const ride = await Ride.findById(rideId);
//     if (!ride) {
//       return res.status(404).json({ error: "Ride not found" });
//     }

//     const stripeAmount = parseInt(amount) * 100; // smallest unit

//     //find existing pending payment for this ride and user
//     const existingPayment = await Payment.findOne({
//       rideId,
//       userId,
//       status: "pending",
//     });
//     if (existingPayment) {
//       return res.status(200).json({
//         message: "Payment already in progress",
//         paymentId: existingPayment._id,
//         payment_link: existingPayment.payment_link,
//       });
//     }

//     // Create Checkout Session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"], // Stripe will show supported methods
//       line_items: [
//         {
//           price_data: {
//             currency: "gmd", // Stripe supports GMD
//             product_data: {
//               name: `Ride Payment for Ride #${rideId}`,
//             },
//             unit_amount: stripeAmount,
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: { userId, rideId },
//       mode: "payment",
//       success_url: `tardem://payment-success`,
//       cancel_url: `tardem://payment-cancel`,
//     });

//     // Save a pending Payment record
//     const payment = await Payment.create({
//       userId,
//       riderId: ride.rider,
//       rideId,
//       amount,
//       method: "card",
//       currency: "GMD",
//       intentId: session.id,
//       payment_link: session.url,
//       return_url: `tardem:/payment/success`,
//       cancel_url: `tardem://rides/${rideId}`,
//     });

//     // Send hosted page URL back to client
//     return res.status(200).json({
//       payment_link: session.url,
//       sessionId: session.id,
//       paymentId: payment._id,
//     });
//   } catch (error) {
//     console.error("Checkout session creation failed:", error);
//     return res.status(500).json({ error: error.message, success: false });
//   }
// };

// stripe webhook handler
// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers["stripe-signature"];

//   let event;
//   try {
//     // req.body is a Buffer thanks to express.raw()
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       // endpointSecret
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log("✅ Webhook verified:", event.type);
//   } catch (err) {
//     console.error("Invalid Stripe webhook signature:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     try {
//       const payment = await Payment.findOne({ intentId: session.id });
//       if (!payment) throw new Error("Payment not found");

//       const fare = Number(payment.amount) || 0;
//       const driverAmount = fare * 0.75;
//       const serviceFee = fare * 0.25;

//       payment.status = "successful";
//       payment.paidAt = new Date();
//       payment.driverAmount = driverAmount;
//       payment.serviceFee = serviceFee;
//       await payment.save();

//       const ride = await Ride.findByIdAndUpdate(
//         payment.rideId,
//         { paidStatus: "paid" },
//         { new: true }
//       );
//       if (!ride) throw new Error("Ride not found");

//       const rider = await User.findByIdAndUpdate(ride.rider, {
//         $inc: { balance: driverAmount },
//       });
//       const user = await User.findById(payment.userId);

//       await sendNotification(
//         `You received a payment of ${payment.amount}`,
//         `You received a payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         "payment",
//         [rider._id]
//       );

//       sendPushNotificationAsync(
//         [rider.expoPushToken],
//         `You received ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         { type: "RIDE_PAYMENT" },
//         `You received ${payment.amount}`
//       );
//       sendPushNotificationAsync(
//         [user.expoPushToken],
//         `Your payment of ${payment.amount} was successful`,
//         { type: "RIDE_PAYMENT" },
//         "Payment successful"
//       );

//       console.log(`Payment processed for ride ${ride._id}`);
//     } catch (processError) {
//       console.error("Error processing Stripe payment:", processError);
//       return res
//         .status(500)
//         .json({ error: `Transaction failed: ${processError.message}` });
//     }
//   }

//   // Respond to Stripe
//   res.json({ received: true });
// };

// cash payment handler
// export const cashPayment = async (req, res) => {
//   try {
//     const { userId, rideId, amount } = req.body;
//     if (!userId || !rideId || !amount) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     if (amount < 10) {
//       return res.status(400).json({ error: "Minimum payment is D 10" });
//     }

//     const ride = await Ride.findById(rideId);
//     if (!ride) {
//       return res.status(404).json({ error: "Ride not found" });
//     }

//     const payment = await Payment.create({
//       userId,
//       riderId: ride.rider,
//       rideId,
//       amount,
//       method: "cash",
//       currency: "GMD",
//     });

//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     try {
//       const fare = Number(payment.amount) || 0;
//       const serviceFee = fare * 0.25;
//       payment.status = "driver_verify_pending";
//       payment.paidAt = new Date();
//       payment.serviceFee = serviceFee;
//       await payment.save();

//       const rider = await User.findById(ride.rider);

//       const user = await User.findById(payment.userId);

//       // /d.d.d./

//       const paymentData = await Payment.findById(payment._id)
//         .populate("userId", "name")
//         .populate("riderId", "name")
//         .populate("rideId")
//         .lean();

//       // if (!payment) return null;
//       if (!paymentData) {
//         return res.status(400).json({ error: "payment Not found" });
//       }
//       // Extract ride details
//       const rideData = payment.rideId;
//       const driverAmount = ride.fare * 0.75;
//       const serviceFeee = ride.fare * 0.25;

//       // Build clean response
//       const paymentRidedata = {
//         _id: payment._id,
//         payment: {
//           amount: paymentData.amount,
//           currency: paymentData.currency,
//           status: paymentData.status,
//           method: paymentData.method,
//           createdAt: paymentData.createdAt,
//           updatedAt: paymentData.updatedAt,
//         },
//         ride: {
//           _id: ride._id,
//           vehicle: ride.vehicle,
//           distance: ride.distance,
//           pickupAddress: ride.pickup.address,
//           dropAddress: ride.drop.address,
//           fare: ride.fare,
//           driverAmount,
//           serviceFeee,
//           status: ride.status,
//           rideType: ride.serviceType,
//           serviceOption: ride.serviceOption,
//           paidStatus: ride.paidStatus,
//         },
//         user: {
//           _id: paymentData.userId._id,
//           name: paymentData.userId.name,
//         },
//         rider: {
//           _id: paymentData.riderId._id,
//           name: paymentData.riderId.name,
//         },
//       };

//       ////
//       await sendNotification(
//         `Verify a cash payment of ${payment.amount}`,
//         `You received a cash payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}. Please verify`,
//         "payment",
//         [rider._id]
//       );

//       sendPushNotificationAsync(
//         [rider.expoPushToken],
//         `Verify a cash payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         {
//           type: "RIDE_PAYMENT_VERIFICATION",
//           payment: paymentRidedata,
//         },
//         `Verify a cash a payment of ${payment.amount}`
//       );

//       sendPushNotificationAsync(
//         [user.expoPushToken],
//         `Your payment of ${payment.amount} was successfull`,
//         {
//           type: "RIDE_PAYMENT",
//           // ride: updatedRide,
//         },
//         "Your Payment was successfull"
//       );

//       return res
//         .status(200)
//         .json({ message: "Payment processed successfully" });
//     } catch (processError) {
//       console.error("Error processing payment:", processError);

//       // Rollback payment status
//       payment.status = "failed";
//       await payment.save();

//       return res
//         .status(500)
//         .json({ error: `Transaction failed: ${processError.message}` });
//     }
//   } catch (error) {
//     console.error("Webhook handler error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// caspayment verify by diver
// export const cashPaymentVerify = async (req, res) => {
//   try {
//     const { userId, rideId, paymentId } = req.body;
//     if (!userId || !rideId || !paymentId) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     const ride = await Ride.findById(rideId);
//     if (!ride) {
//       return res.status(404).json({ error: "Ride not found" });
//     }

//     const payment = await Payment.findById(paymentId);
//     if (!payment) throw new Error("Payment not found");

//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     try {
//       const fare = Number(payment.amount) || 0;
//       const driverAmount = fare * 0.75;
//       payment.driverAmount = driverAmount;
//       payment.status = "successful";
//       const pp = await payment.save();
//       console.log("Payment updated:", pp.status);

//       // Update ride

//       const ride = await Ride.findByIdAndUpdate(
//         payment.rideId,
//         { paidStatus: "paid" },
//         { new: true }
//       );

//       if (!ride) {
//         throw new Error("Associated ride not found");
//       }

//       // Update user balance

//       const rider = await User.findByIdAndUpdate(ride.rider, {
//         $inc: { balance: Number(driverAmount) },
//       });

//       const user = await User.findById(payment.userId);

//       sendPushNotificationAsync(
//         [rider.expoPushToken],
//         `Verification confirm for a cash payment of ${payment.amount} for the ride from ${ride.pickup.address} to ${ride.drop.address}`,
//         {
//           type: "RIDE_PAYMENT",
//           // ride: updatedRide,
//         },
//         `Verification confirm for a cash a payment of ${payment.amount}`
//       );

//       sendPushNotificationAsync(
//         [user.expoPushToken],
//         `Your cash payment of ${payment.amount} was confirmed by the driver`,
//         {
//           type: "RIDE_PAYMENT",
//           // ride: updatedRide,
//         },
//         "Your Payment was confirmed by the driver"
//       );

//       return res
//         .status(200)
//         .json({ message: "Payment processed successfully" });
//     } catch (processError) {
//       console.error("Error processing payment:", processError);

//       // Rollback payment status
//       payment.status = "failed";
//       await payment.save();

//       return res
//         .status(500)
//         .json({ error: `Transaction failed: ${processError.message}` });
//     }
//   } catch (error) {
//     console.error("Webhook handler error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getPaymentStatus = async (req, res) => {
//   try {
//     const { paymentId } = req.params;

//     const payment = await Payment.findById(paymentId);

//     if (!payment) {
//       return res.status(404).json({ error: "Payment not found" });
//     }

//     return res.status(200).json({ status: payment.status });
//   } catch (error) {
//     console.error("Error fetching payment status:", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

// export const getUserTransactions = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId) {
//       return res
//         .status(400)
//         .json({ error: "userId is missing from the request" });
//     }

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(400).json({ error: "user Not found" });
//     }
//     let transactions = [];
//     if (user.role === "customer") {
//       transactions = await Payment.find({ userId: userId }).sort({
//         createdAt: -1,
//       });
//     } else {
//       transactions = await Payment.find({ riderId: userId });
//     }
//     // const transactions = await Payment.find();
//     console.log(transactions);
//     return res.status(200).json({
//       success: true,
//       message: "user Transactions fetch successfully",
//       transactions: transactions,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ message: "Something when wrong", error: err.message });
//   }
// };

// export const getUserTransactions = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     if (!userId) {
//       return res
//         .status(400)
//         .json({ error: "userId is missing from the request" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ error: "User not found" });
//     }

//     let payments = [];
//     if (user.role === "customer") {
//       payments = await Payment.find({ userId })
//         .populate("userId", "name")
//         .populate("riderId", "name")
//         .populate("rideId")
//         .sort({ createdAt: -1 })
//         .lean();
//     } else {
//       payments = await Payment.find({ riderId: userId })
//         .populate("userId", "name")
//         .populate("riderId", "name")
//         .populate("rideId")
//         .sort({ createdAt: -1 })
//         .lean();
//     }

//     // Map payments to clean JSON format
//     const transactions = payments.map((payment) => {
//       const ride = payment.rideId || {};
//       const fare = ride.fare || 0;
//       const driverAmount = fare * 0.75;
//       const serviceFee = fare * 0.25;

//       return {
//         _id: payment._id,
//         payment: {
//           amount: payment.amount,
//           currency: payment.currency,
//           status: payment.status,
//           method: payment.method,
//           createdAt: payment.createdAt,
//           updatedAt: payment.updatedAt,
//         },
//         ride: {
//           _id: ride._id,
//           vehicle: ride.vehicle,
//           distance: ride.distance,
//           pickupAddress: ride.pickup?.address,
//           dropAddress: ride.drop?.address,
//           fare: fare,
//           driverAmount,
//           serviceFee,
//           status: ride.status,
//           rideType: ride.serviceType,
//           serviceOption: ride.serviceOption,
//           paidStatus: ride.paidStatus,
//         },
//         user: {
//           _id: payment.userId?._id,
//           name: payment.userId?.name,
//         },
//         rider: {
//           _id: payment.riderId?._id,
//           name: payment.riderId?.name,
//         },
//       };
//     });

//     return res.status(200).json({
//       success: true,
//       message: "User transactions fetched successfully",
//       transactions,
//     });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       message: "Something went wrong",
//       error: err.message,
//     });
//   }
// };

// export async function getPaymentDetails(req, res) {
//   try {
//     const paymentId = req.params.paymentId;
//     const payment = await Payment.findById(paymentId)
//       .populate("userId", "name")
//       .populate("riderId", "name")
//       .populate("rideId")
//       .lean();

//     // if (!payment) return null;
//     if (!payment) {
//       return res.status(400).json({ error: "payment Not found" });
//     }
//     // Extract ride details
//     const ride = payment.rideId;
//     const driverAmount = ride.fare * 0.75;
//     const serviceFee = ride.fare * 0.25;

//     // Build clean response
//     return res.status(400).json({
//       _id: payment._id,
//       payment: {
//         amount: payment.amount,
//         currency: payment.currency,
//         status: payment.status,
//         method: payment.method,
//         createdAt: payment.createdAt,
//         updatedAt: payment.updatedAt,
//       },
//       ride: {
//         _id: ride._id,
//         vehicle: ride.vehicle,
//         distance: ride.distance,
//         pickupAddress: ride.pickup.address,
//         dropAddress: ride.drop.address,
//         fare: ride.fare,
//         driverAmount,
//         serviceFee,
//         status: ride.status,
//         rideType: ride.serviceType,
//         serviceOption: ride.serviceOption,
//         paidStatus: ride.paidStatus,
//       },
//       user: {
//         _id: payment.userId._id,
//         name: payment.userId.name,
//       },
//       rider: {
//         _id: payment.riderId._id,
//         name: payment.riderId.name,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }
