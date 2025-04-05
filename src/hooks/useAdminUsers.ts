
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { User, ApprovalStatus, UserRole } from "@/types/auth.types";
import { getRemovedUsersFromStorage } from "@/utils/storage.utils";

interface UserFilters {
  role: "all" | UserRole;
  status: "all" | ApprovalStatus;
  searchQuery: string;
}

export const useAdminUsers = () => {
  const { allUsers, loadInitialData, getPendingUsers } = useAuth();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [removedUsers, setRemovedUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRemovedUsers, setShowRemovedUsers] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "all", // Start with all users shown
    searchQuery: "",
  });

  // Load removed users
  const loadRemovedUsers = () => {
    const removed = getRemovedUsersFromStorage();
    console.log("Removed users loaded:", removed.length);
    setRemovedUsers(removed);
  };

  // Force a full data reload on mount
  useEffect(() => {
    console.log("Admin users hook mounted - Loading initial data");
    // Force refresh all user data from localStorage
    loadInitialData();
    
    // Load removed users
    loadRemovedUsers();
    
    // Also do an immediate check for pending users specifically
    const pendingUsers = getPendingUsers();
    console.log(`Initial pending users check: ${pendingUsers.length} pending users found`);
  }, []);

  // Apply filters whenever allUsers or filters change
  useEffect(() => {
    const usersToFilter = showRemovedUsers ? removedUsers : allUsers;
    
    if (!usersToFilter) {
      console.log("No users available to filter");
      return;
    }
    
    console.log(`Filtering ${showRemovedUsers ? 'removed' : 'active'} users:`, usersToFilter.length);
    console.log("Current filters:", filters);
    
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
      
      // Status filter (only for active users)
      if (!showRemovedUsers && filters.status !== "all" && user.approvalStatus !== filters.status) {
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
  }, [allUsers, removedUsers, filters, showRemovedUsers]);

  const handleManualRefresh = (showToast = true) => {
    setIsRefreshing(true);
    
    // Force refresh of user data
    const currentUsers = localStorage.getItem("allUsers");
    console.log("Current users in localStorage:", currentUsers ? JSON.parse(currentUsers) : "None");
    
    // This will re-trigger the auth context to reload data from localStorage
    loadInitialData();
    
    // Reload removed users
    loadRemovedUsers();
    
    // Get pending users specifically to ensure they're loaded
    const pendingUsers = getPendingUsers();
    console.log("Pending users after refresh:", pendingUsers.length);
    
    if (pendingUsers.length > 0) {
      console.log("Pending users details:", pendingUsers);
    }
    
    setTimeout(() => setIsRefreshing(false), 500);
    
    return showToast; // Return this so the parent can decide whether to show toast
  };

  // Toggle between showing active and removed users
  const toggleShowRemovedUsers = () => {
    setShowRemovedUsers(prev => !prev);
  };

  // Modified to ensure we're seeing all users by default
  useEffect(() => {
    console.log("AdminUsers hook initial load - Setting default filter");
    
    // Force refresh data on initial load
    handleManualRefresh(false);
    
    // Set up an interval to refresh data automatically every 15 seconds
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing user data");
      handleManualRefresh(false); // Silent refresh without toast
    }, 15000);
    
    return () => clearInterval(refreshInterval); // Clean up the interval on unmount
  }, []);

  return {
    filteredUsers,
    filters,
    setFilters,
    isRefreshing,
    handleManualRefresh,
    showRemovedUsers,
    toggleShowRemovedUsers,
    userCounts: allUsers ? {
      total: allUsers.length,
      pending: allUsers.filter(u => u.approvalStatus === "pending").length,
      approved: allUsers.filter(u => u.approvalStatus === "approved").length,
      rejected: allUsers.filter(u => u.approvalStatus === "rejected").length,
      removed: removedUsers.length
    } : { total: 0, pending: 0, approved: 0, rejected: 0, removed: 0 }
  };
};
