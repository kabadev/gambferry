// Shared types for the application

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FilterParams {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Re-export model types
// export type {
//   IBooking,
//   IPassenger,
//   IVehicle,
//   ILivestock,
//   ICargo,
// } from "@/lib/models/booking.model";
// export type { IFerry, ICapacity } from "@/lib/models/ferry.model";
// export type { IRoute } from "@/lib/models/route.model";
// export type { ISchedule } from "@/lib/models/schedule.model";
