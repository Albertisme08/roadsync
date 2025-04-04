
import React, { createContext, useContext, useEffect } from "react";
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
    isLoading, 
    login, 
    register, 
    logout, 
    approveUser, 
    rejectUser, 
    getPendingUsers,
    loadInitialData 
  } = useAuthActions();

  // Load initial data and seed admin users on component mount
  useEffect(() => {
    // Seed admin users first
    seedAdminUsers();
    // Then load initial data
    loadInitialData();
  }, []);

  // Determine if user is an admin (has admin role and email matches allowed admin emails)
  const isAdmin = !!user && user.role === "admin" && isAdminEmail(user.email);

  // Create the context value object
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isApproved: !!user && user.approvalStatus === "approved",
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    approveUser,
    rejectUser,
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
