
import { useEffect } from "react";
import { useUser } from "./auth/useUser";
import { useAuthentication } from "./auth/useAuthentication";
import { useRegistration } from "./auth/useRegistration";
import { useUserApproval } from "./auth/useUserApproval";
import { useUserData } from "./auth/useUserData";

export const useAuthActions = () => {
  // Get user state management
  const { 
    user, 
    allUsers, 
    setUser, 
    setAllUsers, 
    isLoading, 
    setIsLoading 
  } = useUser();

  // Get authentication operations
  const { login, logout } = useAuthentication(
    user,
    setUser,
    setAllUsers,
    setIsLoading
  );

  // Get registration operations
  const { register, checkExistingUser, verifyEmail, resendVerification, sendVerificationEmail } = useRegistration(
    setUser,
    setAllUsers,
    setIsLoading
  );

  // Get user approval operations
  const { approveUser, rejectUser, restoreUser, removeUser, restoreRemovedUser } = useUserApproval(
    user,
    allUsers,
    setUser,
    setAllUsers
  );

  // Get user data operations
  const { getPendingUsers, loadInitialData } = useUserData(
    setUser,
    setAllUsers,
    setIsLoading
  );

  useEffect(() => {
    const storedUsers = getAllUsersFromStorage();
    setAllUsers(storedUsers);
    
    const pendingUsers = storedUsers.filter(u => u.approvalStatus === "pending");
    console.log("Pending users on useAuthActions init:", pendingUsers.length);
    if (pendingUsers.length > 0) {
      console.log("Pending users details from useAuthActions:", pendingUsers);
    }
  }, []);

  // Keep for compatibility - now all users are auto-verified but not auto-approved
  const resendCurrentUserVerification = async (): Promise<string> => {
    if (!user || !user.id) {
      return Promise.reject("No user logged in or user ID not available");
    }
    
    console.log("Auto-verifying user:", user.id);
    return resendVerification(user.id);
  };

  return {
    user,
    allUsers,
    setUser,
    setAllUsers,
    isLoading,
    setIsLoading,
    login,
    register,
    logout,
    approveUser,
    rejectUser,
    restoreUser,
    removeUser,
    restoreRemovedUser,
    getPendingUsers,
    loadInitialData,
    checkExistingUser,
    verifyEmail,
    resendVerification: resendCurrentUserVerification,
    sendVerificationEmail
  };
};

// Import getAllUsersFromStorage for the useEffect
import { getAllUsersFromStorage } from "../utils/storage.utils";
