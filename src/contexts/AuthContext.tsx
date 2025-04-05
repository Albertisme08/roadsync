
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../types/auth.types";
import { useAuthActions } from "../hooks/useAuthActions";
import { isAdminEmail, seedAdminUsers } from "../utils/storage.utils";

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Make sure the AuthProvider is defined as a proper React functional component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { 
    user, 
    allUsers,
    isLoading, 
    login, 
    register, 
    logout, 
    approveUser, 
    rejectUser,
    restoreUser,
    getPendingUsers,
    loadInitialData 
  } = useAuthActions();

  // Track if we've done the initial data load
  const [initialized, setInitialized] = useState(false);

  // Load initial data and seed admin users on component mount
  useEffect(() => {
    console.log("AuthProvider initializing");
    // Seed admin users first
    seedAdminUsers();
    // Then load initial data
    loadInitialData();
    setInitialized(true);
  }, []);

  // Determine if user is an admin (has admin role and email matches allowed admin emails)
  const isAdmin = !!user && user.role === "admin" && isAdminEmail(user.email);

  // Log any changes to allUsers for debugging
  useEffect(() => {
    if (allUsers) {
      const pendingCount = allUsers.filter(u => u.approvalStatus === "pending").length;
      console.log("Auth context allUsers updated:", allUsers.length);
      console.log(`Pending users in context: ${pendingCount}`);
      
      if (pendingCount > 0) {
        console.log("Pending users:", allUsers.filter(u => u.approvalStatus === "pending"));
      }
    }
  }, [allUsers]);

  // Create the context value object
  const value: AuthContextType = {
    user,
    allUsers,
    isAuthenticated: !!user,
    isApproved: !!user && user.approvalStatus === "approved",
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    approveUser,
    rejectUser,
    restoreUser,
    getPendingUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
