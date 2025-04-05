
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
  const [filters, setFilters] = useState<UserFilters>({
    role: "all",
    status: "pending", // Default to showing pending users
    searchQuery: "",
  });

  // Force a full data reload on mount
  useEffect(() => {
    console.log("Admin users hook mounted - Loading initial data");
    // Force refresh all user data from localStorage
    loadInitialData();
    
    // Also do an immediate check for pending users specifically
    const pendingUsers = getPendingUsers();
    console.log(`Initial pending users check: ${pendingUsers.length} pending users found`);
  }, []);

  // Apply filters whenever allUsers or filters change
  useEffect(() => {
    if (!allUsers) {
      console.log("No users available in allUsers");
      return;
    }
    
    console.log("All users from auth context:", allUsers);
    console.log("Current filters:", filters);
    
    // Count pending users before filtering
    const pendingCount = allUsers.filter(u => u.approvalStatus === "pending").length;
    console.log(`Total pending users before filtering: ${pendingCount}`);
    
    if (pendingCount > 0) {
      console.log("Pending users before filtering:", 
        allUsers.filter(u => u.approvalStatus === "pending"));
    }
    
    const filtered = allUsers.filter((user) => {
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
          user.name?.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.businessName?.toLowerCase().includes(query) ||
          user.dotNumber?.includes(query) ||
          user.mcNumber?.includes(query);
          
        if (!matchesQuery) return false;
      }
      
      return true;
    });
    
    console.log(`Filtered users count: ${filtered.length}`);
    console.log("Filtered users:", filtered);
    
    setFilteredUsers(filtered);
  }, [allUsers, filters]);

  const handleManualRefresh = (showToast = true) => {
    setIsRefreshing(true);
    
    // Force refresh of user data
    const currentUsers = localStorage.getItem("allUsers");
    console.log("Current users in localStorage:", currentUsers ? JSON.parse(currentUsers) : "None");
    
    // This will re-trigger the auth context to reload data from localStorage
    loadInitialData();
    
    // Get pending users specifically to ensure they're loaded
    const pendingUsers = getPendingUsers();
    console.log("Pending users after refresh:", pendingUsers.length);
    
    if (pendingUsers.length > 0) {
      console.log("Pending users details:", pendingUsers);
    }
    
    setTimeout(() => setIsRefreshing(false), 500);
    
    return showToast; // Return this so the parent can decide whether to show toast
  };

  // Reset to showing pending users
  useEffect(() => {
    console.log("AdminUsers hook initial load - Setting default filter to pending");
    // Ensure the status filter is set to pending by default
    setFilters(prev => ({
      ...prev,
      status: "pending"
    }));
    
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
    userCounts: allUsers ? {
      total: allUsers.length,
      pending: allUsers.filter(u => u.approvalStatus === "pending").length,
      approved: allUsers.filter(u => u.approvalStatus === "approved").length,
      rejected: allUsers.filter(u => u.approvalStatus === "rejected").length
    } : { total: 0, pending: 0, approved: 0, rejected: 0 }
  };
};

