
import { z } from 'zod';

// User schema matching the types in auth.types.ts
export const userSchema = z.object({
  role: z.enum(['shipper', 'carrier']),
  businessName: z.string(),
  dotNumber: z.string().optional(),
  mcNumber: z.string().optional(),
  description: z.string().optional(),
  phone: z.string(),
});

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
//   description: 'Shipping business',
//   phone: '555-1234',
// };
// validateUserData(exampleUser);
