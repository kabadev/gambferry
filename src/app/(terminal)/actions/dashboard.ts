// app/actions/analytics.actions.ts
"use server";

import { connectDB } from "@/lib/mongoDB";
import { Booking } from "@/models/Booking";
import { Ferry } from "@/models/Ferry";
import { Schedule } from "@/models/Schedule";

export async function getDashboardAnalytics(
  period: "week" | "month" | "year" = "month"
) {
  try {
    await connectDB();

    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Aggregate booking data
    const bookingStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          booking_status: { $ne: "Cancelled" },
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$amount" },
          totalPassengers: { $sum: "$num_passengers" },
          totalVehicles: {
            $sum: { $cond: [{ $ne: ["$vehicle_type", null] }, 1, 0] },
          },
          totalCattle: { $sum: "$livestock.cattle" },
          totalSheepGoats: { $sum: "$livestock.sheep_goats" },
          totalRice: { $sum: "$cargo.rice_bags" },
          totalGroundnut: { $sum: "$cargo.groundnut_bags" },
          totalCement: { $sum: "$cargo.cement_bags" },
          totalCartons: { $sum: "$cargo.cartons" },
        },
      },
    ]);

    // Booking status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$booking_status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Payment status breakdown
    const paymentBreakdown = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$payment_status",
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    // Passenger type breakdown
    const passengerTypeBreakdown = await Booking.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$passenger_type",
          count: { $sum: 1 },
          passengers: { $sum: "$num_passengers" },
        },
      },
    ]);

    // Daily bookings for charts (last 7 days)
    const dailyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" },
          passengers: { $sum: "$num_passengers" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Monthly bookings for trend analysis
    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Ferry statistics
    const ferryStats = await Ferry.aggregate([
      {
        $group: {
          _id: null,
          totalFerries: { $sum: 1 },
          activeFerries: {
            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] },
          },
          totalCapacity: { $sum: "$passengers_capacity" },
        },
      },
    ]);

    // Schedule statistics
    const scheduleStats = await Schedule.aggregate([
      {
        $match: {
          departureDate: {
            $gte: startDate.toISOString().split("T")[0],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSchedules: { $sum: 1 },
          scheduledTrips: {
            $sum: { $cond: [{ $eq: ["$status", "Scheduled"] }, 1, 0] },
          },
          delayedTrips: {
            $sum: { $cond: [{ $eq: ["$status", "Delayed"] }, 1, 0] },
          },
          cancelledTrips: {
            $sum: { $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0] },
          },
        },
      },
    ]);

    // Top routes
    const topRoutes = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          booking_status: { $ne: "Cancelled" },
        },
      },
      {
        $lookup: {
          from: "routes",
          localField: "route",
          foreignField: "_id",
          as: "routeInfo",
        },
      },
      { $unwind: "$routeInfo" },
      {
        $group: {
          _id: "$route",
          routeName: { $first: "$routeInfo.route_name" },
          bookings: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 5 },
    ]);

    return {
      success: true,
      data: {
        overview: bookingStats[0] || {},
        statusBreakdown,
        paymentBreakdown,
        passengerTypeBreakdown,
        dailyBookings,
        monthlyBookings,
        ferryStats: ferryStats[0] || {},
        scheduleStats: scheduleStats[0] || {},
        topRoutes,
      },
    };
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch analytics",
    };
  }
}

export async function getRevenueAnalytics(
  period: "week" | "month" | "year" = "month"
) {
  try {
    await connectDB();

    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Revenue by payment method
    const revenueByMethod = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: "$payment_method",
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    // Revenue by passenger type
    const revenueByPassengerType = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          payment_status: "Paid",
        },
      },
      {
        $group: {
          _id: "$passenger_type",
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      success: true,
      data: {
        revenueByMethod,
        revenueByPassengerType,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch revenue analytics",
    };
  }
}
