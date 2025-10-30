import { z } from "zod";

export const createScheduleSchema = z.object({
  ferryId: z.string().min(1, "Ferry is required"),
  routeId: z.string().min(1, "Route is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  arrivalTime: z.string().min(1, "Arrival time is required"),
  availableSeats: z.number().min(0, "Available seats must be positive"),
  price: z.number().min(0, "Price must be positive"),
  duplicateDays: z.number().min(0).max(7).optional(),
});

export const updateScheduleSchema = z.object({
  id: z.string().min(1, "Schedule ID is required"),
  status: z
    .enum(["scheduled", "departed", "arrived", "cancelled", "delayed"])
    .optional(),
  departureTime: z.string().optional(),
  arrivalTime: z.string().optional(),
  availableSeats: z.number().min(0).optional(),
  price: z.number().min(0).optional(),
});

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
