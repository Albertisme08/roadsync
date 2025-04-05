import { useState, useEffect } from "react";
import { User, UserRole, ApprovalStatus } from "../types/auth.types";
import { 
  getUserFromStorage, 
  setUserInStorage, 
  removeUserFromStorage,
  getAllUsersFromStorage,
  setAllUsersInStorage,
  isAdminEmail
} from "../utils/storage.utils";

export const useAuthActions = () => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [allUsers, setAllUsers] = useState<User[]>(getAllUsersFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUsers = getAllUsersFromStorage();
    setAllUsers(storedUsers);
    
    const pendingUsers = storedUsers.filter(u => u.approvalStatus === "pending");
    console.log("Pending users on useAuthActions init:", pendingUsers.length);
    if (pendingUsers.length > 0) {
      console.log("Pending users details from useAuthActions:", pendingUsers);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (role === "admin") {
        if (!isAdminEmail(email)) {
          throw new Error("You don't have admin privileges");
        }
        
        if (password !== "Skaterboo8!") {
          throw new Error("Invalid admin password");
        }
        
        const existingUsers = getAllUsersFromStorage();
        let adminUser = existingUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        if (!adminUser) {
          adminUser = {
            id: Math.random().toString(36).substring(2, 9),
            email: email,
            name: "Admin User",
            role: "admin",
            approvalStatus: "approved"
          };
          
          existingUsers.push(adminUser);
          setAllUsersInStorage(existingUsers);
          setAllUsers(existingUsers);
        } else {
          adminUser.role = "admin";
          adminUser.approvalStatus = "approved";
          
          const updatedUsers = existingUsers.map((u) =>
            u.id === adminUser!.id ? adminUser! : u
          );
          setAllUsersInStorage(updatedUsers);
          setAllUsers(updatedUsers);
        }
        
        setUserInStorage(adminUser);
        setUser(adminUser);
        setIsLoading(false);
        return;
      }
      
      const existingUsers = getAllUsersFromStorage();
      const existingUser = existingUsers.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        if (isAdminEmail(email)) {
          existingUser.role = "admin";
          existingUser.approvalStatus = "approved";
          
          const updatedUsers = existingUsers.map(u => 
            u.id === existingUser.id ? existingUser : u
          );
          setAllUsersInStorage(updatedUsers);
          setAllUsers(updatedUsers);
        }
        
        if (existingUser.approvalStatus === "rejected") {
          throw new Error("Your account has been rejected. Please contact support.");
        }
        
        setUserInStorage(existingUser);
        setUser(existingUser);
      } else {
        throw new Error("User not found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    businessName?: string,
    dotNumber?: string,
    mcNumber?: string,
    phone?: string,
    description?: string,
    city?: string,
    address?: string,
    equipmentType?: string,
    maxWeight?: string
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const existingUsers = getAllUsersFromStorage();
      const userExists = existingUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        throw new Error("User with this email already exists");
      }
      
      const isAdmin = isAdminEmail(email);
      
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: isAdmin ? "admin" : role,
        approvalStatus: isAdmin ? "approved" : "pending",
        businessName,
        dotNumber,
        mcNumber,
        phone,
        description,
        city,
        address,
        equipmentType,
        maxWeight
      };
      
      console.log("Registering new user with data:", newUser);
      
      const updatedUsers = [...existingUsers, newUser];
      
      setAllUsersInStorage(updatedUsers);
      
      setAllUsers(updatedUsers);
      
      setUserInStorage(newUser);
      setUser(newUser);
      
      const pendingUsers = updatedUsers.filter(u => u.approvalStatus === "pending");
      console.log("All users after registration:", updatedUsers.length);
      console.log("Pending users after registration:", pendingUsers.length);
      console.log("Pending users details:", pendingUsers);
      
      if (isAdmin) {
        console.log(`Welcome email sent to admin: ${email}`);
      } else {
        console.log(`New user registration: ${name} (${email}) - needs approval`);
        console.log(`Pending user data added to localStorage: ${JSON.stringify(newUser)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
  };
  
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
  
  const getPendingUsers = () => {
    const allStorageUsers = getAllUsersFromStorage();
    const pendingUsers = allStorageUsers.filter(u => u.approvalStatus === "pending");
    console.log(`Getting pending users: found ${pendingUsers.length} pending users`);
    return pendingUsers;
  };

  const loadInitialData = () => {
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
    loadInitialData
  };
};
