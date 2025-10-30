"use server";

import { revalidatePath } from "next/cache";

import { connectDB } from "@/lib/mongoDB";
import {
  CreateScheduleInput,
  UpdateScheduleInput,
  updateScheduleSchema,
} from "../validations/schedule.validation";

import { Schedule } from "@/models/Schedule";
import { Booking } from "@/models/Booking";
import { Ferry } from "@/models/Ferry";
import { Route } from "@/models/Route";

export async function createSchedule(data: CreateScheduleInput) {
  try {
    await connectDB();

    const schedule = await Schedule.create(data);
    revalidatePath("/terminal/schedules");
    revalidatePath("/terminal");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(schedule)),
    };
  } catch (error) {
    console.error(" Create schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create schedule" };
  }
}

export async function getSchedules(filters?: {
  status?: string;
  ferryId?: string;
  routeId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectDB();
    Ferry;
    Route;
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;
    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};

    if (filters?.status && filters.status !== "all") {
      query.status = filters.status;
    }

    if (filters?.ferryId) {
      query.ferryId = filters.ferryId;
    }

    if (filters?.routeId) {
      query.routeId = filters.routeId;
    }

    if (filters?.startDate || filters?.endDate) {
      query.departureTime = {};
      if (filters.startDate) {
        (query.departureTime as { $gte?: Date }).$gte = new Date(
          filters.startDate
        );
      }
      if (filters.endDate) {
        (query.departureTime as { $lte?: Date }).$lte = new Date(
          filters.endDate
        );
      }
    }
    // await Route.find();

    const [schedules, total] = await Promise.all([
      Schedule.find(query)
        .populate("ferry_id")
        .populate("route_id")
        .sort({ departureTime: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Schedule.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        schedules: JSON.parse(JSON.stringify(schedules)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error(" Get schedules error:", error);
    return { success: false, error: "Failed to fetch schedules" };
  }
}

export async function getScheduleById(id: string) {
  try {
    await connectDB();

    const schedule = await Schedule.findById(id)
      .populate("ferry_id")
      .populate("route_id");

    if (!schedule) {
      return { success: false, error: "Schedule not found" };
    }

    // Get booking count for this schedule
    const bookingCount = await Booking.countDocuments({ scheduleId: id });

    return {
      success: true,
      data: {
        ...JSON.parse(JSON.stringify(schedule)),
        bookingCount,
      },
    };
  } catch (error) {
    console.error(" Get schedule error:", error);
    return { success: false, error: "Failed to fetch schedule" };
  }
}

export async function updateSchedule(data: UpdateScheduleInput) {
  try {
    await connectDB();

    const schedule = await Schedule.findById(data.id);
    if (!schedule) {
      return { success: false, error: "Schedule not found" };
    }

    // If changing departure time, check for conflicts
    if (data.departureTime) {
      const departureDate = new Date(data.departureTime);
      const conflict = await Schedule.findOne({
        _id: { $ne: data.id },
        ferry_id: schedule.ferry_id,
        departureTime: {
          $gte: new Date(departureDate.getTime() - 2 * 60 * 60 * 1000),
          $lte: new Date(departureDate.getTime() + 2 * 60 * 60 * 1000),
        },
        status: { $in: ["scheduled", "departed"] },
      });

      if (conflict) {
        return {
          success: false,
          error:
            "Schedule conflict detected. Ferry is already scheduled within 2 hours of this time.",
        };
      }
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(data.id, data, {
      new: true,
    })
      .populate("ferry_id")
      .populate("route_id");

    revalidatePath("/terminal/schedules");
    revalidatePath(`/terminal/schedules/${data.id}`);
    revalidatePath("/terminal");

    return { success: true, data: JSON.parse(JSON.stringify(updatedSchedule)) };
  } catch (error) {
    console.error(" Update schedule error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update schedule" };
  }
}

export async function deleteSchedule(id: string) {
  try {
    await connectDB();

    // Check if schedule has bookings
    const bookingCount = await Booking.countDocuments({ scheduleId: id });

    if (bookingCount > 0) {
      return {
        success: false,
        error: `Cannot delete schedule with ${bookingCount} booking(s). Please cancel the schedule instead.`,
      };
    }

    const schedule = await Schedule.findByIdAndDelete(id);

    if (!schedule) {
      return { success: false, error: "Schedule not found" };
    }

    revalidatePath("/admin/schedules");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(" Delete schedule error:", error);
    return { success: false, error: "Failed to delete schedule" };
  }
}

export async function getScheduleAnalytics(period: "today" | "week" | "month") {
  try {
    await connectDB();

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
    }

    const schedules = await Schedule.find({
      departureTime: { $gte: startDate },
    }).lean();

    const analytics = {
      totalSchedules: schedules.length,
      scheduledTrips: schedules.filter((s) => s.status === "scheduled").length,
      departedTrips: schedules.filter((s) => s.status === "departed").length,
      arrivedTrips: schedules.filter((s) => s.status === "arrived").length,
      cancelledTrips: schedules.filter((s) => s.status === "cancelled").length,
      delayedTrips: schedules.filter((s) => s.status === "delayed").length,
      totalRevenuePotential: schedules.reduce(
        (sum, s) => sum + s.price * s.availableSeats,
        0
      ),
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error(" Get schedule analytics error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}

export async function getAvailableSchedules(filters?: {
  routeId?: string;
  departureDate?: string;
}) {
  try {
    await connectDB();

    const query: Record<string, unknown> = {
      status: "scheduled",
      availableSeats: { $gt: 0 },
    };

    if (filters?.routeId) {
      query.routeId = filters.routeId;
    }

    if (filters?.departureDate) {
      const date = new Date(filters.departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      query.departureTime = {
        $gte: date,
        $lt: nextDay,
      };
    } else {
      // Only show future schedules
      query.departureTime = { $gte: new Date() };
    }

    const schedules = await Schedule.find(query)
      .populate("ferryId")
      .populate("routeId")
      .sort({ departureTime: 1 })
      .lean();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(schedules)),
    };
  } catch (error) {
    console.error(" Get available schedules error:", error);
    return { success: false, error: "Failed to fetch available schedules" };
  }
}
