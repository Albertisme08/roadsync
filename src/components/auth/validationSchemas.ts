
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

const shipperSchema = baseRegisterSchema.extend({
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
}).refine(
  (data) => {
    if (data.role === "shipper") {
      // Shipper validation: DOT and MC numbers should be empty
      return !data.dotNumber && !data.mcNumber;
    }
    return true;
  },
  {
    message: "Shippers should not provide MC or DOT numbers",
    path: ["dotNumber"],
  }
);

const driverSchema = baseRegisterSchema.extend({
  dotNumber: z.string().min(1, { message: "DOT Number is required for carriers" }).optional(),
  mcNumber: z.string().min(1, { message: "MC Number is required for carriers" }).optional(),
}).refine(
  (data) => {
    if (data.role === "driver") {
      // Driver validation: At least one of DOT or MC number must be provided
      return !!data.dotNumber || !!data.mcNumber;
    }
    return true;
  },
  {
    message: "Please provide a valid MC or DOT number",
    path: ["dotNumber"],
  }
);

export const registerSchema = z.discriminatedUnion("role", [
  shipperSchema.extend({ role: z.literal("shipper") }),
  driverSchema.extend({ role: z.literal("driver") }),
]).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
