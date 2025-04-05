
// User roles
export type UserRole = "shipper" | "carrier" | "admin";

// Approval status for user accounts
export type ApprovalStatus = "pending" | "approved" | "rejected";

// User model
export interface User {
  id: string;
  name?: string;
  email: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  approvalDate?: number; // Timestamp for when user was approved
  businessName?: string;
  dotNumber?: string;
  mcNumber?: string;
  phone?: string;
  description?: string;
  city?: string;
  address?: string;
  equipmentType?: string;
  maxWeight?: string;
  rejectionDate?: number; // Timestamp for when user was rejected
  restorationDate?: number; // Timestamp for when user was restored
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  allUsers: User[]; // Add this to expose all users to components
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    businessName: string,
    dotNumber: string,
    mcNumber: string,
    phone: string,
    description: string,
    city?: string,
    address?: string,
    equipmentType?: string,
    maxWeight?: string
  ) => Promise<void>;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  restoreUser: (userId: string, approvalStatus: ApprovalStatus) => void; // New function to restore rejected users
  getPendingUsers: () => User[];
}
