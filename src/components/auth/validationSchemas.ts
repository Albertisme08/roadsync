
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  role: z.enum(["shipper", "driver"]),
});

const baseRegisterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6),
  role: z.enum(["shipper", "driver"], {
    required_error: "Please select a role",
  }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  businessName: z.string().optional(),
  description: z.string().optional(),
});

// Schema for shipper role
const shipperSchema = z.object({
  role: z.literal("shipper"),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  businessName: z.string().min(1, { message: "Business name is required for shippers" }),
  description: z.string().min(1, { message: "Business description is required for shippers" }),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
}).refine(
  (data) => {
    // Shipper validation: DOT and MC numbers should be empty
    return !data.dotNumber && !data.mcNumber;
  },
  {
    message: "Shippers should not provide MC or DOT numbers",
    path: ["dotNumber"],
  }
);

// Schema for driver role
const driverSchema = z.object({
  role: z.literal("driver"),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string().min(6),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  businessName: z.string().optional(),
  description: z.string().optional(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
}).refine(
  (data) => {
    // Driver validation: At least one of DOT or MC number must be provided
    return !!data.dotNumber || !!data.mcNumber;
  },
  {
    message: "Please provide a valid MC or DOT number",
    path: ["dotNumber"],
  }
);

// Combined schema using discriminated union
export const registerSchema = z.discriminatedUnion("role", [
  shipperSchema,
  driverSchema,
]).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
