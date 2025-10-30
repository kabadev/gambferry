// app/actions/booking.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { Schedule } from "@/models/Schedule";
import { Booking } from "@/models/Booking";
import { connectDB } from "@/lib/mongoDB";

// Generate unique booking reference
function generateBookingReference(): string {
  const prefix = "GMB";
  const random = Math.floor(Math.random() * 90000000) + 10000000;
  return `${prefix}${random}`;
}

export async function getBookings(filters?: {
  status?: string;
  paymentStatus?: string;
  search?: string;
  dateFilter?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();

    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (filters?.status && filters.status !== "all") {
      query.booking_status = filters.status;
    }

    if (filters?.paymentStatus && filters.paymentStatus !== "all") {
      query.payment_status = filters.paymentStatus;
    }

    if (filters?.search) {
      query.$or = [
        { booking_reference: { $regex: filters.search, $options: "i" } },
        { passenger_email: { $regex: filters.search, $options: "i" } },
        { passenger_phone: { $regex: filters.search, $options: "i" } },
        { passenger_name: { $regex: filters.search, $options: "i" } },
      ];
    }

    // Date filter for schedule's departureDate
    if (filters?.dateFilter) {
      const filterDate = filters.dateFilter;

      // First get all schedules that match the date
      const schedules = await Schedule.find({
        departureDate: filterDate,
      }).select("_id");

      const scheduleIds = schedules.map((s) => s._id);

      if (scheduleIds.length > 0) {
        query.schedule = { $in: scheduleIds };
      } else {
        // No schedules found for this date, return empty
        return {
          success: true,
          data: {
            bookings: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
            },
          },
        };
      }
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .populate("ferry")
        .populate("route")
        .populate("schedule")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        bookings: JSON.parse(JSON.stringify(bookings)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get bookings error:", error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}

export async function deleteBooking(id: string) {
  try {
    await connectDB();

    const booking = await Booking.findById(id);

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    await Booking.findByIdAndDelete(id);

    revalidatePath("/terminal/bookings");

    return { success: true };
  } catch (error) {
    console.error("Delete booking error:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

export async function getBookingAnalytics(period: "day" | "week" | "month") {
  try {
    await connectDB();

    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date();

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
    }

    // Get schedules within the date range
    const schedules = await Schedule.find({
      departureDate: {
        $gte: startDate.toISOString().split("T")[0],
        $lte: endDate.toISOString().split("T")[0],
      },
    }).select("_id");

    const scheduleIds = schedules.map((s) => s._id);

    // Get bookings for those schedules
    const bookings = await Booking.find({
      schedule: { $in: scheduleIds },
    }).lean();

    const analytics = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      totalPassengers: bookings.reduce(
        (sum, b) => sum + (b.num_passengers || 0),
        0
      ),
      totalVehicles: bookings.filter((b) => b.vehicle_type).length,
      totalCattle: bookings.reduce(
        (sum, b) => sum + (b.livestock?.cattle || 0),
        0
      ),
      totalSheepGoats: bookings.reduce(
        (sum, b) => sum + (b.livestock?.sheep_goats || 0),
        0
      ),
      totalCargo: bookings.reduce(
        (sum, b) =>
          sum +
          (b.cargo?.rice_bags || 0) +
          (b.cargo?.groundnut_bags || 0) +
          (b.cargo?.cement_bags || 0) +
          (b.cargo?.cartons || 0),
        0
      ),
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error("Get booking analytics error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

export async function getBookingById(id: string) {
  try {
    await connectDB();

    const booking = await Booking.findById(id)
      .populate("ferry")
      .populate("route")
      .populate("schedule");

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Get booking error:", error);
    return { success: false, error: "Failed to fetch booking" };
  }
}

export async function updateBookingStatus(
  id: string,
  status: "Confirmed" | "Cancelled" | "Completed" | "Pending"
) {
  try {
    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { booking_status: status },
      { new: true }
    );

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    revalidatePath("/terminal/bookings");
    revalidatePath(`/terminal/bookings/${id}`);

    return { success: true, data: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Update booking status error:", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function updatePaymentStatus(
  id: string,
  paymentStatus: "Pending" | "Paid" | "Failed" | "Refunded"
) {
  try {
    await connectDB();

    const booking = await Booking.findByIdAndUpdate(
      id,
      { payment_status: paymentStatus },
      { new: true }
    );

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    revalidatePath("/terminal/bookings");
    revalidatePath(`/terminal/bookings/${id}`);

    return { success: true, data: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Update payment status error:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}
