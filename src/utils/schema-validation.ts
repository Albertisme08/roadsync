
import { z } from 'zod';
import { UserRole } from '@/types/auth.types';

// User schema matching the types in auth.types.ts
export const userSchema = z.object({
  role: z.enum(['shipper', 'carrier']),
  businessName: z.string(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  description: z.string().optional(),
  phone: z.string(),
  // Add new fields
  city: z.string().optional(),
  address: z.string().optional(),
  equipmentType: z.string().optional(),
  maxWeight: z.string().optional(),
  // Add dock information fields if needed in the future
});

// MC and DOT number validation functions
export const isValidMCNumber = (value: string | undefined): boolean => {
  if (!value) return true;
  return /^MC-\d{5,8}$/.test(value) || /^\d{5,8}$/.test(value);
};

export const isValidDOTNumber = (value: string | undefined): boolean => {
  if (!value) return true;
  return /^\d{5,8}$/.test(value);
};

// Function to validate user data
export const validateUserData = (userData: unknown) => {
  try {
    const validatedData = userSchema.parse(userData);
    console.log('User data is valid:', validatedData);
    return validatedData;
  } catch (error) {
    console.error('Invalid user data:', error);
    throw error;
  }
};

// Example usage
// const exampleUser = {
//   role: 'shipper',
//   businessName: 'ABC Logistics',
//   dotNumber: '1234567',
//   mcNumber: '7891234',
//   description: 'Shipping business with 3 docks',
//   phone: '555-1234',
// };
// validateUserData(exampleUser);
