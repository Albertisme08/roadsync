import { User, ApprovalStatus } from "@/types/auth.types";
import { 
  setAllUsersInStorage,
  setUserInStorage,
  getRemovedUsersFromStorage,
  setRemovedUsersInStorage 
} from "@/utils/storage.utils";
import { toast } from "@/lib/sonner";

export const useUserApproval = (
  user: User | null,
  allUsers: User[],
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void
) => {
  const approveUser = (userId: string) => {
    const approvalDate = Date.now();
    
    const userToApprove = allUsers.find(u => u.id === userId);
    
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
          toast.success(`Account Approved`, {
            description: `${approvedUser.name || approvedUser.email}'s account has been approved. They can now post loads.`,
            duration: 5000,
          });
          
          if (user && user.id === userId) {
            toast.success("Account Approved", {
              description: "Your account has been approved! You now have full access to all platform features.",
              duration: 5000,
            });
          }
          
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

  const removeUser = (userId: string) => {
    const userToRemove = allUsers.find(u => u.id === userId);
    
    if (!userToRemove) {
      console.error(`User with ID ${userId} not found`);
      return;
    }
    
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    
    const removedUser = {
      ...userToRemove,
      removedDate: Date.now()
    };
    
    const removedUsers = getRemovedUsersFromStorage();
    const updatedRemovedUsers = [...removedUsers, removedUser];
    
    setAllUsersInStorage(updatedUsers);
    setRemovedUsersInStorage(updatedRemovedUsers);
    
    setAllUsers(updatedUsers);
    
    if (user && user.id === userId) {
      setUser(null);
    }
    
    console.log(`User ${removedUser.name || removedUser.email} has been removed from active users.`);
  };

  const restoreRemovedUser = (userId: string) => {
    const removedUsers = getRemovedUsersFromStorage();
    
    const userToRestore = removedUsers.find(u => u.id === userId);
    
    if (!userToRestore) {
      console.error(`Removed user with ID ${userId} not found`);
      return;
    }
    
    const { removedDate, ...restoredUser } = userToRestore;
    
    const updatedUsers = [...allUsers, restoredUser];
    
    const updatedRemovedUsers = removedUsers.filter(u => u.id !== userId);
    
    setAllUsersInStorage(updatedUsers);
    setRemovedUsersInStorage(updatedRemovedUsers);
    
    setAllUsers(updatedUsers);
    
    console.log(`User ${restoredUser.name || restoredUser.email} has been restored to active users.`);
  };

  return {
    approveUser,
    rejectUser,
    restoreUser,
    removeUser,
    restoreRemovedUser
  };
};
