
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, ApprovalStatus, UserRole } from "@/types/auth.types";

interface UserFilters {
  role: "all" | UserRole;
  status: "all" | ApprovalStatus;
  searchQuery: string;
}

export const useAdminUsers = () => {
  const { allUsers, loadInitialData, getPendingUsers } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRemovedUsers, setShowRemovedUsers] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all",
    searchQuery: "",
  });

  // Force a full data reload on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Apply filters whenever allUsers or filters change
  useEffect(() => {
    const usersToFilter = allUsers;
    
    if (!usersToFilter || !Array.isArray(usersToFilter)) {
      console.log("No users available to filter or users is not an array");
      setFilteredUsers([]);
      return;
    }
    
    console.log(`Filtering users:`, usersToFilter.length);
    console.log("Current filters:", filters);
    
    try {
      // Count users by approval status for debugging
      const pendingCount = usersToFilter.filter(u => u.approvalStatus === "pending").length;
      const approvedCount = usersToFilter.filter(u => u.approvalStatus === "approved").length;
      const rejectedCount = usersToFilter.filter(u => u.approvalStatus === "rejected").length;
      
      console.log(`Users by status before filtering: pending=${pendingCount}, approved=${approvedCount}, rejected=${rejectedCount}`);
      
      // Apply filters
      const filtered = usersToFilter.filter((user) => {
        // Role filter
        if (filters.role !== "all" && user.role !== filters.role) {
          return false;
        }
        
        // Status filter
        if (filters.status !== "all" && user.approvalStatus !== filters.status) {
          return false;
        }
        
        // Search query (name, email, business name, DOT/MC number)
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase();
          const matchesQuery = 
            (user.name || "").toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            (user.businessName || "").toLowerCase().includes(query) ||
            (user.dotNumber || "").includes(query) ||
            (user.mcNumber || "").includes(query);
            
          if (!matchesQuery) return false;
        }
        
        return true;
      });
      
      console.log(`Filtered users count: ${filtered.length}`);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error("Error filtering users:", error);
      setFilteredUsers([]);
    }
  }, [allUsers, filters]);

  const handleManualRefresh = (showToast = true) => {
    setIsRefreshing(true);
    loadInitialData();
    setTimeout(() => setIsRefreshing(false), 500);
    return showToast;
  };

  // Toggle between showing active and removed users
  const toggleShowRemovedUsers = () => {
    setShowRemovedUsers(prev => !prev);
  };

  return {
    filteredUsers,
    filters,
    setFilters,
    isRefreshing,
    handleManualRefresh,
    showRemovedUsers,
    toggleShowRemovedUsers,
    userCounts: allUsers ? {
      total: Array.isArray(allUsers) ? allUsers.length : 0,
      pending: Array.isArray(allUsers) ? allUsers.filter(u => u.approvalStatus === "pending").length : 0,
      approved: Array.isArray(allUsers) ? allUsers.filter(u => u.approvalStatus === "approved").length : 0,
      rejected: Array.isArray(allUsers) ? allUsers.filter(u => u.approvalStatus === "rejected").length : 0,
      removed: 0
    } : { total: 0, pending: 0, approved: 0, rejected: 0, removed: 0 }
  };
};
