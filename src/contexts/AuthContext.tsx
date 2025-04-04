
import React, { createContext, useContext, useEffect } from "react";
import { AuthContextType } from "../types/auth.types";
import { useAuthActions } from "../hooks/useAuthActions";

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

  // Load initial data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Create the context value object
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isApproved: !!user && user.approvalStatus === "approved",
    isAdmin: !!user && user.role === "admin",
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
