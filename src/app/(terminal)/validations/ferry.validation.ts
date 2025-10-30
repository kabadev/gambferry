import { z } from "zod"

export const capacitySchema = z.object({
  passengers: z.number().min(0, "Passengers capacity must be positive"),
  vehicles: z.number().min(0, "Vehicles capacity must be positive"),
  cattle: z.number().min(0, "Cattle capacity must be positive"),
  sheepGoats: z.number().min(0, "Sheep/Goats capacity must be positive"),
  rice: z.number().min(0, "Rice capacity must be positive"),
  groundnut: z.number().min(0, "Groundnut capacity must be positive"),
  cement: z.number().min(0, "Cement capacity must be positive"),
  cartons: z.number().min(0, "Cartons capacity must be positive"),
})

export const createFerrySchema = z.object({
  name: z.string().min(2, "Ferry name must be at least 2 characters").max(100, "Name is too long"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  capacity: capacitySchema,
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
  imageUrl: z.string().url("Invalid image URL").optional().or(z.literal("")),
  yearBuilt: z.number().min(1900).max(new Date().getFullYear()).optional(),
  lastMaintenance: z.string().optional(),
})

export const updateFerrySchema = createFerrySchema.partial().extend({
  id: z.string().min(1, "Ferry ID is required"),
})

export type CreateFerryInput = z.infer<typeof createFerrySchema>
export type UpdateFerryInput = z.infer<typeof updateFerrySchema>
