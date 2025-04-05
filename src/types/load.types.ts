
// Load approval status
export type LoadApprovalStatus = "pending" | "approved" | "rejected";

// Load model
export interface Load {
  id: string;
  shipperId: string;
  shipperName?: string;
  shipperEmail?: string;
  pickupLocation: string;
  deliveryLocation: string;
  equipmentType: string;
  weight: string;
  rate: string;
  availableDate: Date;
  contactInfo: string;
  notes?: string;
  submissionDate: number; // Timestamp
  approvalStatus: LoadApprovalStatus;
  approvalDate?: number; // Timestamp when load was approved/rejected
  reviewedBy?: string; // Admin who reviewed the load
  rejectionReason?: string; // Optional reason for rejection
}

// Load context type
export interface LoadContextType {
  loads: Load[];
  userLoads: Load[]; // Filtered loads for the current user
  pendingLoads: Load[]; // Loads pending approval
  approvedLoads: Load[]; // Approved loads
  rejectedLoads: Load[]; // Rejected loads
  addLoad: (load: Omit<Load, "id" | "submissionDate" | "approvalStatus">) => string;
  updateLoad: (loadId: string, updates: Partial<Load>) => void;
  deleteLoad: (loadId: string) => void;
  approveLoad: (loadId: string, adminId: string) => void;
  rejectLoad: (loadId: string, adminId: string, reason?: string) => void;
  getLoadById: (loadId: string) => Load | undefined;
  loadInitialData: () => void;
}
