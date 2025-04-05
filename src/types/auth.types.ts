
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
  businessName?: string;
  dotNumber?: string;
  mcNumber?: string;
  phone?: string;
  description?: string;
}

// Authentication context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isLoading: boolean;
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
    description: string
  ) => Promise<void>;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  getPendingUsers: () => User[];
}
