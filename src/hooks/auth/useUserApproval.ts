
import { User, ApprovalStatus } from "@/types/auth.types";
import { 
  setAllUsersInStorage,
  setUserInStorage 
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

  return {
    approveUser,
    rejectUser,
    restoreUser
  };
};
