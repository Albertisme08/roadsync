
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["shipper", "carrier"]), 
});

// Base schema with common fields
const baseFields = {
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
};

// Schema for shipper role
export const shipperSchema = z.object({
  ...baseFields,
  role: z.literal("shipper"),
  businessName: z.string().min(1, { message: "Business name is required for shippers" }),
  description: z.string().min(1, { message: "Business description is required for shippers" }),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
});

// Schema for carrier role
export const carrierSchema = z.object({
  ...baseFields,
  role: z.literal("carrier"),
  businessName: z.string().optional(),
  description: z.string().optional(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
});

// First create the combined schema
export const registerSchema = z.discriminatedUnion("role", [
  shipperSchema,
  carrierSchema,
]).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Add separate carrier validation that doesn't break TypeScript's discriminated union
export const validateCarrierData = (data: z.infer<typeof registerSchema>) => {
  if (data.role === "carrier" && !data.dotNumber && !data.mcNumber) {
    throw new Error("Please provide a valid MC or DOT number");
  }
  return data;
};

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
