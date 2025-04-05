
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["shipper", "carrier"]), 
});

// Phone number validation function for US format
const validatePhoneNumber = (value: string) => {
  // Remove all non-digit characters for validation
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

// Base schema with common fields
const baseFields = {
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6),
  phone: z.string().refine(validatePhoneNumber, { 
    message: "Please enter a valid U.S. phone number" 
  }),
  businessName: z.string().min(1, { message: "Business name is required" }),
  description: z.string().optional(),
};

// Schema for shipper role
export const shipperSchema = z.object({
  ...baseFields,
  role: z.literal("shipper"),
  city: z.string().min(1, { message: "City is required" }),
  address: z.string().optional(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
});

// Schema for carrier role with MC/DOT number requirement
export const carrierSchema = z.object({
  ...baseFields,
  role: z.literal("carrier"),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  equipmentType: z.string().min(1, { message: "Equipment type is required" }),
  maxWeight: z.string().min(1, { message: "Maximum weight is required" }),
});

// Create the combined schema
export const registerSchema = z.discriminatedUnion("role", [
  shipperSchema,
  carrierSchema,
])
.refine(
  (data) => {
    // Make sure carrier has either MC or DOT number
    if (data.role === "carrier") {
      return Boolean(data.dotNumber || data.mcNumber);
    }
    return true;
  },
  {
    message: "Please enter either an MC number or a DOT number",
    path: ["dotNumber"],
  }
)
.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
