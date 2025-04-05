
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
  const { approveUser, rejectUser, restoreUser } = useUserApproval(
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
    getPendingUsers,
    loadInitialData,
    checkExistingUser,
    verifyEmail,
    resendVerification,
    sendVerificationEmail
  };
};

// Import getAllUsersFromStorage for the useEffect
import { getAllUsersFromStorage } from "../utils/storage.utils";
