"use server";

import { revalidatePath } from "next/cache";
import {
  CreateRouteInput,
  createRouteSchema,
  UpdateRouteInput,
  updateRouteSchema,
} from "../validations/route.validation";
import { connectDB } from "@/lib/mongoDB";
import { Route } from "@/models/Route";
import { Schedule } from "@/models/Schedule";

export async function createRoute(data: CreateRouteInput) {
  try {
    await connectDB();
    const route = await Route.create(data);
    revalidatePath("/terminal/routes");
    revalidatePath("/terminal");

    return {
      success: true,
      data: { id: route._id.toString() },
    };
  } catch (error) {
    console.error(" Create route error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create route" };
  }
}

export async function getRoutes(filters?: {
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
        { name: { $regex: filters.search, $options: "i" } },
        { departurePort: { $regex: filters.search, $options: "i" } },
        { arrivalPort: { $regex: filters.search, $options: "i" } },
      ];
    }

    const [routes, total] = await Promise.all([
      Route.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Route.countDocuments(query),
    ]);

    return {
      success: true,
      data: {
        routes: JSON.parse(JSON.stringify(routes)),
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error) {
    console.error(" Get routes error:", error);
    return { success: false, error: "Failed to fetch routes" };
  }
}

export async function getRouteById(id: string) {
  try {
    await connectDB();

    const route = await Route.findById(id).lean();

    if (!route) {
      return { success: false, error: "Route not found" };
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(route)),
    };
  } catch (error) {
    console.error(" Get route error:", error);
    return { success: false, error: "Failed to fetch route" };
  }
}

export async function updateRoute(data: UpdateRouteInput) {
  try {
    const { id, ...updateData } = data;

    await connectDB();

    const route = await Route.findByIdAndUpdate(id, updateData, { new: true });

    if (!route) {
      return { success: false, error: "Route not found" };
    }

    revalidatePath("/terminal/routes");
    revalidatePath(`/terminal/routes/${id}`);
    revalidatePath("/terminal");

    return { success: true, data: JSON.parse(JSON.stringify(route)) };
  } catch (error) {
    console.error(" Update route error:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update route" };
  }
}

export async function deleteRoute(id: string) {
  try {
    await connectDB();

    // Check if route has active schedules
    const activeSchedules = await Schedule.countDocuments({
      routeId: id,
      status: { $in: ["scheduled", "departed"] },
    });

    if (activeSchedules > 0) {
      return {
        success: false,
        error:
          "Cannot delete route with active schedules. Please cancel or complete all schedules first.",
      };
    }

    const route = await Route.findByIdAndDelete(id);

    if (!route) {
      return { success: false, error: "Route not found" };
    }

    revalidatePath("/admin/routes");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error(" Delete route error:", error);
    return { success: false, error: "Failed to delete route" };
  }
}

export async function getRouteAnalytics() {
  try {
    await connectDB();

    const routes = await Route.find().lean();

    const analytics = {
      totalRoutes: routes.length,
      activeRoutes: routes.filter((r) => r.status === "active").length,
      inactiveRoutes: routes.filter((r) => r.status === "inactive").length,
      totalDistance: routes.reduce((sum, r) => sum + r.distance, 0),
      averageDistance: routes.length
        ? Math.round(
            routes.reduce((sum, r) => sum + r.distance, 0) / routes.length
          )
        : 0,
      totalBasePrice: routes.reduce((sum, r) => sum + r.basePrice, 0),
      averagePrice: routes.length
        ? Math.round(
            routes.reduce((sum, r) => sum + r.basePrice, 0) / routes.length
          )
        : 0,
    };

    return { success: true, data: analytics };
  } catch (error) {
    console.error(" Get route analytics error:", error);
    return { success: false, error: "Failed to fetch analytics" };
  }
}
