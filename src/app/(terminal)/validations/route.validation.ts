import { z } from "zod"

export const createRouteSchema = z.object({
  name: z.string().min(2, "Route name must be at least 2 characters").max(100, "Name is too long"),
  departurePort: z.string().min(2, "Departure port is required"),
  arrivalPort: z.string().min(2, "Arrival port is required"),
  distance: z.number().min(0, "Distance must be positive"),
  estimatedDuration: z.number().min(0, "Duration must be positive"),
  basePrice: z.number().min(0, "Base price must be positive"),
  status: z.enum(["active", "inactive"]).default("active"),
})

export const updateRouteSchema = createRouteSchema.partial().extend({
  id: z.string().min(1, "Route ID is required"),
})

export type CreateRouteInput = z.infer<typeof createRouteSchema>
export type UpdateRouteInput = z.infer<typeof updateRouteSchema>
