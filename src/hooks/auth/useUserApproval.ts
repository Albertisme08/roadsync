
import { User, ApprovalStatus } from "@/types/auth.types";
import { 
  setAllUsersInStorage,
  setUserInStorage,
  getRemovedUsersFromStorage,
  setRemovedUsersInStorage 
} from "@/utils/storage.utils";

export const useUserApproval = (
  user: User | null,
  allUsers: User[],
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void
) => {
  const approveUser = (userId: string) => {
    const approvalDate = Date.now();
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: "approved" as ApprovalStatus,
        approvalDate,
        rejectionDate: undefined
      } : u
    );
    
    setAllUsersInStorage(updatedUsers);
    
    setAllUsers(updatedUsers);
    
    if (user && user.id === userId) {
      const updatedUser = { 
        ...user, 
        approvalStatus: "approved" as ApprovalStatus,
        approvalDate,
        rejectionDate: undefined
      };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    const approvedUser = updatedUsers.find(u => u.id === userId);
    if (approvedUser) {
      console.log(`Welcome email sent to ${approvedUser.email}: Your account has been approved!`);
      if (typeof window !== 'undefined') {
        try {
          console.log(`NOTIFICATION: ${approvedUser.name}'s account has been approved. 
                      An email notification has been sent to ${approvedUser.email} 
                      informing them they can now post shipments.`);
        } catch (error) {
          console.error("Error showing notification:", error);
        }
      }
    }
  };
  
  const rejectUser = (userId: string) => {
    const rejectionDate = Date.now();
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: "rejected" as ApprovalStatus,
        rejectionDate
      } : u
    );
    
    setAllUsersInStorage(updatedUsers);
    
    setAllUsers(updatedUsers);
    
    if (user && user.id === userId) {
      const updatedUser = { 
        ...user, 
        approvalStatus: "rejected" as ApprovalStatus,
        rejectionDate
      };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    const rejectedUser = updatedUsers.find(u => u.id === userId);
    if (rejectedUser) {
      console.log(`Rejection email sent to ${rejectedUser.email}: We're sorry, your RoadSync account has not been approved.`);
    }
  };

  const restoreUser = (userId: string, newStatus: ApprovalStatus = "pending") => {
    const restorationDate = Date.now();
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: newStatus,
        restorationDate,
        rejectionDate: undefined,
        approvalDate: newStatus === "approved" ? restorationDate : undefined
      } : u
    );
    
    setAllUsersInStorage(updatedUsers);
    
    setAllUsers(updatedUsers);
    
    if (user && user.id === userId) {
      const updatedUser = { 
        ...user, 
        approvalStatus: newStatus,
        restorationDate,
        rejectionDate: undefined,
        approvalDate: newStatus === "approved" ? restorationDate : undefined
      };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    const restoredUser = updatedUsers.find(u => u.id === userId);
    if (restoredUser) {
      const statusMessage = newStatus === "approved" 
        ? "Your account has been restored and approved. You can now use all platform features."
        : "Your account has been restored and is pending review.";
        
      console.log(`Restoration email sent to ${restoredUser.email}: ${statusMessage}`);
    }
  };

  // New function to remove a user
  const removeUser = (userId: string) => {
    const userToRemove = allUsers.find(u => u.id === userId);
    
    if (!userToRemove) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
    
    // Filter out the user from active users
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    
    // Add removal date to the user
    const removedUser = {
      ...userToRemove,
      removedDate: Date.now()
    };
    
    // Get current removed users and add this one
    const removedUsers = getRemovedUsersFromStorage();
    const updatedRemovedUsers = [...removedUsers, removedUser];
    
    // Update storage
    setAllUsersInStorage(updatedUsers);
    setRemovedUsersInStorage(updatedRemovedUsers);
    
    // Update state
    setAllUsers(updatedUsers);
    
    // If the removed user is the current user, log them out
    if (user && user.id === userId) {
      setUser(null);
    }
    
    console.log(`User ${removedUser.name || removedUser.email} has been removed from active users.`);
  };

  // New function to restore a removed user
  const restoreRemovedUser = (userId: string) => {
    // Get all removed users
    const removedUsers = getRemovedUsersFromStorage();
    
    // Find the user to restore
    const userToRestore = removedUsers.find(u => u.id === userId);
    
    if (!userToRestore) {
      console.error(`Removed user with ID ${userId} not found`);
      return;
    }
    
    // Remove the removedDate property
    const { removedDate, ...restoredUser } = userToRestore;
    
    // Add user back to active users
    const updatedUsers = [...allUsers, restoredUser];
    
    // Remove user from removed users
    const updatedRemovedUsers = removedUsers.filter(u => u.id !== userId);
    
    // Update storage
    setAllUsersInStorage(updatedUsers);
    setRemovedUsersInStorage(updatedRemovedUsers);
    
    // Update state
    setAllUsers(updatedUsers);
    
    console.log(`User ${restoredUser.name || restoredUser.email} has been restored to active users.`);
  };

  return {
    approveUser,
    rejectUser,
    restoreUser,
    removeUser, // New function
    restoreRemovedUser // New function
  };
};
