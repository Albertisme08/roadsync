
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
