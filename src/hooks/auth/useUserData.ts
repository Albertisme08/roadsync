
import { User } from "@/types/auth.types";
import { 
  getAllUsersFromStorage, 
  getUserFromStorage, 
  setUserInStorage,
  isAdminEmail
} from "@/utils/storage.utils";

export const useUserData = (
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  const getPendingUsers = () => {
    // Ensure we're getting the latest data from localStorage
    const allStorageUsers = getAllUsersFromStorage();
    const pendingUsers = allStorageUsers.filter(u => u.approvalStatus === "pending");
    console.log(`Getting pending users: found ${pendingUsers.length} pending users`);
    return pendingUsers;
  };

  const loadInitialData = () => {
    // Ensure localStorage has allUsers initialized
    if (!localStorage.getItem("allUsers")) {
      localStorage.setItem("allUsers", JSON.stringify([]));
    }
    
    const storedUsers = getAllUsersFromStorage();
    console.log("Loading users from storage:", storedUsers.length);
    
    const pendingUsers = storedUsers.filter(u => u.approvalStatus === "pending");
    console.log("Pending users in storage:", pendingUsers.length);
    
    if (pendingUsers.length > 0) {
      console.log("Pending users details from storage:", pendingUsers);
    }
    
    setAllUsers(storedUsers);
    
    const storedUser = getUserFromStorage();
    if (storedUser) {
      if (isAdminEmail(storedUser.email)) {
        storedUser.role = "admin";
        storedUser.approvalStatus = "approved";
        setUserInStorage(storedUser);
      }
      setUser(storedUser);
    }
    
    setIsLoading(false);
  };

  return {
    getPendingUsers,
    loadInitialData
  };
};
