
import { z } from "zod";

// Common leaked passwords list
const commonPasswords = [
  "password", "123456", "password123", "admin", "qwerty", "letmein", 
  "welcome", "monkey", "dragon", "master", "123456789", "football"
];

// Enhanced password validation
const validateSecurePassword = (password: string) => {
  // Check minimum length
  if (password.length < 8) return false;
  
  // Check for leaked/common passwords
  if (commonPasswords.includes(password.toLowerCase())) return false;
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Check for at least one number
  if (!/\d/.test(password)) return false;
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  
  return true;
};

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

// MC and DOT number validation - stricter requirements
const validateMCNumber = (value: string | undefined) => {
  if (!value) return true;
  // Must be MC- followed by 6-8 digits or just 6-8 digits
  return /^MC-\d{6,8}$/.test(value) || /^\d{6,8}$/.test(value);
};

const validateDOTNumber = (value: string | undefined) => {
  if (!value) return true;
  // Must be exactly 6-8 digits
  return /^\d{6,8}$/.test(value);
};

// Base schema with common fields
const baseFields = {
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .refine(validateSecurePassword, { 
      message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character. Common passwords are not allowed." 
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
  dotNumber: z.string().optional()
    .refine(validateDOTNumber, { message: "Invalid DOT number format" }),
  mcNumber: z.string().optional()
    .refine(validateMCNumber, { message: "Invalid MC number format" }),
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
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
