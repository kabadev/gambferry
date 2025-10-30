"use server";

import { createCashPayment, createPayment } from "@/app/actions/PaymentAction";
import { bookings, ferries, routes, schedules } from "@/lib/data";
import type { Booking as BookingType } from "@/lib/data";
import { calculateFare, FareData } from "@/lib/fare-calculator";
import { connectDB } from "@/lib/mongoDB";
import { Booking } from "@/models/Booking";
import { Ferry } from "@/models/Ferry";
import { Route } from "@/models/Route";
import { Schedule } from "@/models/Schedule";
import { auth, currentUser } from "@clerk/nextjs/server";
// import { calculateFare, type FareData } from "@/lib/fare-calculator";

// Create a new booking
export async function createBooking(data: any): Promise<any> {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not found");
    }
    // Generate booking reference
    const bookingRef = `REF${Date.now().toString().slice(-8)}`;

    const fareData: FareData = {
      passenger_type: data.passenger_type,
      num_passengers: data.num_passengers,
      vehicle_type: data.vehicle_type,
      vehicle_weight_tons: data.vehicle_weight_tons,
      vehicle_length_meters: data.vehicle_length_meters,
      commercial_pax: data.commercial_pax,
      cattle: data.cattle,
      sheep_goats: data.sheep_goats,
      rice_bags: data.rice_bags,
      groundnut_bags: data.groundnut_bags,
      cement_bags: data.cement_bags,
      cartons: data.cartons,
    };

    const fareResult = await calculateFare(fareData);
    const amount =
      data.currency === "GMD" ? fareResult.totalGMD : fareResult.totalCFA;

    // Optional: Validate ferry and route before booking
    const ferryExists = await Ferry.findById(data.ferry._id);
    const routeExists = await Route.findById(data.route._id);
    const scheduleExists = await Schedule.findById(data.schedule_id);
    if (!ferryExists || !routeExists || !scheduleExists) {
      throw new Error("Invalid ferry, route or schedule reference.");
    }

    // Build booking document
    const booking = new Booking({
      userId: userId,
      ferry: data.ferry._id,
      route: data.route._id,
      schedule: data.schedule_id,
      booking_reference: bookingRef,
      passenger_name: data.passenger_name,
      passenger_email: data.passenger_email,
      passenger_phone: data.passenger_phone,
      num_passengers: data.num_passengers,
      departure_date: data.departure_date,
      passenger_type: data.passenger_type,
      vehicle_type: data.vehicle_type,
      vehicle_plate: data.vehicle_plate,
      livestock: {
        cattle: data.cattle || 0,
        sheep_goats: data.sheep_goats || 0,
      },
      cargo: {
        rice_bags: data.rice_bags || 0,
        groundnut_bags: data.groundnut_bags || 0,
        cement_bags: data.cement_bags || 0,
        cartons: data.cartons || 0,
      },
      amount,
      currency: data.currency,
      payment_method: data.payment_method,
      payment_status: "Pending",
      booking_status: "Pending",
    });

    const savedBooking = await booking.save();

    let paymentIntent = null;
    // Save to MongoDB
    console.log("Payment Method:", data.payment_method);
    if (data.payment_method !== "Cash") {
      paymentIntent = await createPayment({
        userId,
        bookingId: savedBooking._id,
        amount,
        method: data.payment_method,
        currency: data.currency,
        terminal: data.terminal || false,
      });
    } else {
      paymentIntent = await createCashPayment({
        userId,
        bookingId: savedBooking._id,
        amount,
        method: data.payment_method,
        currency: data.currency,
      });
    }

    // Optionally send confirmation email (mock)
    console.log(`✅ Booking confirmation sent to ${data.passenger_email}`);
    return {
      success: true,
      message: "Booking confirmed successfully",
      data: {
        booking: JSON.parse(JSON.stringify(savedBooking)),
        payment: paymentIntent,
        method: data.payment_method,
      },
    };
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return {
      success: false,
      message: "Booking creation failed",
      error: error.message,
    };
  }
  // return newBooking;
}

// Get a single booking by ID
export async function getBookingById(id: string) {
  // get booking by id
  const booking = await Booking.findById(id)
    .populate("userId")
    .populate("ferry")
    .populate("route")
    .populate("schedule");
  if (!booking) {
    return { success: false, error: "Booking not found" };
  }
  return {
    success: true,
    message: "Booking found",
    booking: JSON.parse(JSON.stringify(booking)),
  };
}

// Get a single booking by reference
export async function getBookingByReference(ref: string) {
  // get booking by reference
  const booking = await Booking.findOne({ booking_reference: ref })
    .populate("userId")
    .populate("ferry_id")
    .populate("route_id")
    .populate("schedule_id");
  if (!booking) {
    return { success: false, error: "Booking not found" };
  }
  return {
    success: true,
    message: "Booking found",
    booking: JSON.parse(JSON.stringify(booking)),
  };
}

// Get bookings by schedule_id, ferry_id, or userId
// Unified booking fetch function
export async function getBookings(
  filter: {
    schedule_id?: string;
    ferry_id?: string;
    userId?: string;
  } = {}
) {
  try {
    const query: any = {};

    // Dynamically add filters if provided
    if (filter.schedule_id) query.schedule_id = filter.schedule_id;
    if (filter.ferry_id) query.ferry_id = filter.ferry_id;
    if (filter.userId) query.userId = filter.userId;

    const bookings = await Booking.find(query)
      .populate("userId")
      .populate("ferry_id")
      .populate("route_id")
      .populate("schedule_id");

    if (!bookings || bookings.length === 0) {
      return { success: false, message: "No bookings found" };
    }

    return {
      success: true,
      message: "Bookings fetched successfully",
      bookings: JSON.parse(JSON.stringify(bookings)),
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

//deleteBooking
export async function deleteBooking(id: string) {
  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return { success: false, message: "Booking not found" };
    }
    await booking.deleteOne();
    return { success: true, message: "Booking deleted successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function getScheduleById(id: number) {
  // getsheduleferry and route and return as one object
  const schedule = schedules.find((s) => s.schedule_id === id);
  if (!schedule) {
    return null;
  }
  const ferry = ferries.find((f) => f.id === schedule.ferry_id);
  if (!ferry) {
    return null;
  }
  const route = routes.find((r) => r.id === schedule.route_id);
  if (!route) {
    return null;
  }
  return {
    ...schedule,
    ferry,
    route,
  };
}

export async function searchFerries(params: any) {
  try {
    const { departurePort, arrivalPort, departureDate } = params;

    // Validate input
    if (!departurePort || !arrivalPort || !departureDate) {
      return {
        success: false,
        error: "Departure port, arrival port, and date are required",
      };
    }

    await connectDB();

    // Find matching route
    const route = await Route.findOne({
      departurePort: { $regex: new RegExp(`^${departurePort}$`, "i") },
      arrivalPort: { $regex: new RegExp(`^${arrivalPort}$`, "i") },
      active: true,
    });

    if (!route) {
      return {
        success: true,
        data: [],
        message: "No route found for the selected ports",
      };
    }

    // Parse the date to match against departureDate
    const searchDate = new Date(departureDate);

    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);

    //     {
    //   departurePort: 'Banjul Port',
    //   arrivalPort: 'Barra Port',
    //   departureDate: '2025-10-26'
    // }
    // 2025-10-26T00:00:00.000Z

    // Find matching schedules
    const schedules = await Schedule.find({
      route_id: route._id,
      status: { $in: ["Scheduled", "scheduled"] }, // Only show available schedules
    })
      .populate("ferry_id")
      .populate("route_id");
    // .sort({ departureDate: 1 });

    // Transform the data to match the expected format
    const results = schedules.map((schedule: any) => ({
      _id: schedule._id.toString(),
      schedule_id: schedule.schedule_id,
      ferry_id: schedule.ferry_id._id.toString(),
      route_id: schedule.route_id._id.toString(),
      departureDate: schedule.departureDate,
      departureTime: schedule.departureTime,
      arrivalTime: schedule.arrivalTime,
      status: schedule.status,
      // Ferry data
      ferry_name: schedule.ferry_id.ferry_name,
      ferry_code: schedule.ferry_id.ferry_code,
      ferry_type: schedule.ferry_id.ferry_type,
      ferry_image: schedule.ferry_id.ferry_image,
      passengers_capacity: schedule.ferry_id.passengers_capacity,
      cattle_capacity: schedule.ferry_id.cattle_capacity,
      rgc_capacity: schedule.ferry_id.rgc_capacity,
      sg_capacity: schedule.ferry_id.sg_capacity,
      ppcp_capacity: schedule.ferry_id.ppcp_capacity,
      ferry_status: schedule.ferry_id.status,
      // Route data
      route_name: schedule.route_id.route_name,
      base_price: schedule.route_id.base_price,
      duration: schedule.route_id.duration,
      distance_km: schedule.route_id.distance_km,
      departurePort: schedule.route_id.departurePort,
      arrivalPort: schedule.route_id.arrivalPort,
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(results)),
      count: results.length,
    };
  } catch (error) {
    console.error("❌ Search ferries error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to search ferries" };
  }
}
