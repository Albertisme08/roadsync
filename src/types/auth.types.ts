
// User roles
export type UserRole = "shipper" | "carrier" | "admin";

// Approval status for user accounts
export type ApprovalStatus = "pending" | "approved" | "rejected";

// Verification status for email verification
export type VerificationStatus = "unverified" | "verified";

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
  removedDate?: number; // Timestamp for when user was removed
  _showRestoreOptions?: boolean; // UI state flag for showing restore options
  verificationStatus?: VerificationStatus; // All users are auto-verified now
  verificationToken?: string; // Token for email verification (kept for backwards compatibility)
  verificationExpiry?: number; // Expiry timestamp for verification token (kept for backwards compatibility)
  registrationDate?: number; // Timestamp for when user registered
  isFirstVisit?: boolean; // Flag to track if this is the user's first visit to sections of the app
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  allUsers: User[]; // Add this to expose all users to components
  setUser: (user: User | null) => void; // Add setter for user
  setAllUsers: (users: User[]) => void; // Add setter for allUsers
  setIsLoading: (isLoading: boolean) => void; // Add setter for isLoading
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
  restoreUser: (userId: string, approvalStatus: ApprovalStatus) => void; // Function to restore rejected users
  removeUser: (userId: string) => void; // Function to remove users
  restoreRemovedUser: (userId: string) => void; // Function to restore removed users
  getPendingUsers: () => User[];
  loadInitialData: () => void; // Added this missing function to the interface
  checkExistingUser?: (email: string) => { exists: boolean; status?: string; user?: User }; // Function to check existing users
  verifyEmail: (token: string, email: string) => boolean; // Function for email verification (kept for backwards compatibility)
  resendVerification: (userId: string) => Promise<string>; // Updated to return Promise<string>
}
