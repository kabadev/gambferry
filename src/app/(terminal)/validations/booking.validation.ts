import { z } from "zod"

export const passengerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  age: z.number().min(0, "Age must be positive").max(150, "Invalid age"),
  gender: z.enum(["male", "female", "other"]),
  idType: z.string().min(2, "ID type is required"),
  idNumber: z.string().min(3, "ID number is required"),
})

export const vehicleSchema = z.object({
  type: z.string().min(2, "Vehicle type is required"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  length: z.number().min(0).optional(),
})

export const livestockSchema = z.object({
  cattle: z.number().min(0).default(0),
  sheepGoats: z.number().min(0).default(0),
})

export const cargoSchema = z.object({
  rice: z.number().min(0).default(0),
  groundnut: z.number().min(0).default(0),
  cement: z.number().min(0).default(0),
  cartons: z.number().min(0).default(0),
})

export const createBookingSchema = z.object({
  scheduleId: z.string().min(1, "Schedule is required"),
  passengers: z.array(passengerSchema).min(1, "At least one passenger is required"),
  contactPhone: z.string().min(10, "Valid phone number is required"),
  contactEmail: z.string().email("Valid email is required"),
  vehicles: z.array(vehicleSchema).default([]),
  livestock: livestockSchema.default({ cattle: 0, sheepGoats: 0 }),
  cargo: cargoSchema.default({ rice: 0, groundnut: 0, cement: 0, cartons: 0 }),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  paymentMethod: z.string().optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
