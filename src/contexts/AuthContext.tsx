
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
    setUser,
    setAllUsers,
    setIsLoading,
    login, 
    register, 
    logout, 
    approveUser, 
    rejectUser,
    restoreUser,
    getPendingUsers,
    loadInitialData,
    checkExistingUser,
    verifyEmail,
    resendVerification
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

  // Check if user is authenticated (user exists and is not null - no verification check)
  const isAuthenticated = !!user;

  // Log any changes to allUsers for debugging
  useEffect(() => {
    if (allUsers) {
      console.log("Auth context allUsers updated:", allUsers.length);
    }
  }, [allUsers]);

  // Create the context value object
  const value: AuthContextType = {
    user,
    allUsers,
    isAuthenticated,
    isApproved: !!user && user.approvalStatus === "approved",
    isAdmin,
    isLoading,
    setUser,
    setAllUsers,
    setIsLoading,
    login,
    register,
    logout,
    approveUser,
    rejectUser,
    restoreUser,
    getPendingUsers,
    loadInitialData,
    checkExistingUser,
    verifyEmail,
    resendVerification
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
