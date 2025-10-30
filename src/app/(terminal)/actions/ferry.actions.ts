"use server";

import { revalidatePath } from "next/cache";
import {
  CreateFerryInput,
  createFerrySchema,
  UpdateFerryInput,
  updateFerrySchema,
} from "../validations/ferry.validation";
import { connectDB } from "@/lib/mongoDB";
import { Ferry } from "@/models/Ferry";
import { Schedule } from "@/models/Schedule";

export async function createFerry(data: any) {
  try {
    // Validate input
    // const validatedData = createFerrySchema.parse(data);

    await connectDB();
    console.log(data);
    // Check if ferry with same name or registration number exists

    const ferry = await Ferry.create(data);
    console.log("ferry:", ferry);
    return {
      success: true,
      data: { id: ferry._id.toString() },
    };
  } catch (error) {
    console.error(" Create ferry error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create ferry" };
  }
}

export async function getFerries(filters?: {
  status?: string;
  search?: string;
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
      query.status = filters.status;
    }

    if (filters?.search) {
      query.$or = [
        { ferry_name: { $regex: filters.search, $options: "i" } },
        { ferry_code: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [ferries, total] = await Promise.all([
      Ferry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Ferry.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        ferries: JSON.parse(JSON.stringify(ferries)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error(" Get ferries error:", error);
    return { success: false, error: "Failed to fetch ferries" };
  }
}

export async function getFerryById(id: string) {
  try {
    await connectDB();

    const ferry = await Ferry.findById(id).lean();

    if (!ferry) {
      return { success: false, error: "Ferry not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(ferry)),
    };
  } catch (error) {
    console.error(" Get ferry error:", error);
    return { success: false, error: "Failed to fetch ferry" };
  }
}

export async function updateFerry(data: UpdateFerryInput) {
  try {
    // Validate input
    const validatedData = updateFerrySchema.parse(data);
    const { id, ...updateData } = validatedData;

    await connectDB();

    // Check if updating name or registration number conflicts with existing ferry
    if (updateData.name || updateData.registrationNumber) {
      const existingFerry = await Ferry.findOne({
        _id: { $ne: id },
        $or: [
          ...(updateData.name ? [{ name: updateData.name }] : []),
          ...(updateData.registrationNumber
            ? [{ registrationNumber: updateData.registrationNumber }]
            : []),
        ],
      });

      if (existingFerry) {
        return {
          success: false,
          error: "Ferry with this name or registration number already exists",
        };
      }
    }

    const ferry = await Ferry.findByIdAndUpdate(id, updateData, { new: true });

    if (!ferry) {
      return { success: false, error: "Ferry not found" };
    }

    revalidatePath("/admin/ferries");
    revalidatePath(`/admin/ferries/${id}`);
    revalidatePath("/admin");

    return { success: true, data: JSON.parse(JSON.stringify(ferry)) };
  } catch (error) {
    console.error(" Update ferry error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update ferry" };
  }
}

export async function deleteFerry(id: string) {
  try {
    await connectDB();

    // Check if ferry has active schedules
    const activeSchedules = await Schedule.countDocuments({
      ferryId: id,
      status: { $in: ["scheduled", "departed"] },
    });

    if (activeSchedules > 0) {
      return {
        success: false,
        error:
          "Cannot delete ferry with active schedules. Please cancel or complete all schedules first.",
      };
    }

    const ferry = await Ferry.findByIdAndDelete(id);

    if (!ferry) {
      return { success: false, error: "Ferry not found" };
    }

    revalidatePath("/admin/ferries");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(" Delete ferry error:", error);
    return { success: false, error: "Failed to delete ferry" };
  }
}

export async function getFerryAnalytics() {
  try {
    await connectDB();

    const ferries = await Ferry.find().lean();

    const analytics = {
      totalFerries: ferries.length,
      activeFerries: ferries.filter((f) => f.status === "active").length,
      maintenanceFerries: ferries.filter((f) => f.status === "maintenance")
        .length,
      inactiveFerries: ferries.filter((f) => f.status === "inactive").length,
      totalPassengerCapacity: ferries.reduce(
        (sum, f) => sum + f.capacity.passengers,
        0
      ),
      totalVehicleCapacity: ferries.reduce(
        (sum, f) => sum + f.capacity.vehicles,
        0
      ),
      averageAge: ferries.filter((f) => f.yearBuilt).length
        ? Math.round(
            ferries
              .filter((f) => f.yearBuilt)
              .reduce(
                (sum, f) =>
                  sum + (new Date().getFullYear() - (f.yearBuilt || 0)),
                0
              ) / ferries.filter((f) => f.yearBuilt).length
          )
        : 0,
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error(" Get ferry analytics error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
