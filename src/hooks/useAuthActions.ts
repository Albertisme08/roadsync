
import { useState } from "react";
import { User, UserRole, ApprovalStatus } from "../types/auth.types";
import { 
  getUserFromStorage, 
  setUserInStorage, 
  removeUserFromStorage,
  getAllUsersFromStorage,
  setAllUsersInStorage
} from "../utils/storage.utils";

export const useAuthActions = () => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [allUsers, setAllUsers] = useState<User[]>(getAllUsersFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user exists in our mock database
      const existingUsers = getAllUsersFromStorage();
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        // For demo purposes, we're not checking password
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
    description?: string
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check for admin email
      const isAdmin = email === "alopezcargo@outlook.com" || email === "fwdfwdit@gmail.com";
      
      // Mock successful registration
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
        description
      };
      
      // Add to all users
      const existingUsers = getAllUsersFromStorage();
      existingUsers.push(newUser);
      setAllUsersInStorage(existingUsers);
      setAllUsers(existingUsers);
      
      // Set as current user
      setUserInStorage(newUser);
      setUser(newUser);
      
      // If this is the admin account, automatically approve
      if (isAdmin) {
        // Send welcome email (simulated)
        console.log(`Welcome email sent to admin: ${email}`);
      } else {
        // Send notification to admin (simulated)
        console.log(`New user registration: ${name} (${email}) - needs approval`);
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
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, approvalStatus: "approved" as ApprovalStatus } : u
    );
    
    setAllUsers(updatedUsers);
    setAllUsersInStorage(updatedUsers);
    
    // If the approved user is the current user, update their status
    if (user && user.id === userId) {
      const updatedUser = { ...user, approvalStatus: "approved" as ApprovalStatus };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    // Send welcome email (simulated)
    const approvedUser = updatedUsers.find(u => u.id === userId);
    if (approvedUser) {
      console.log(`Welcome email sent to ${approvedUser.email}: Your RoadSync account has been approved!`);
    }
  };
  
  const rejectUser = (userId: string) => {
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, approvalStatus: "rejected" as ApprovalStatus } : u
    );
    
    setAllUsers(updatedUsers);
    setAllUsersInStorage(updatedUsers);
    
    // If the rejected user is the current user, update their status
    if (user && user.id === userId) {
      const updatedUser = { ...user, approvalStatus: "rejected" as ApprovalStatus };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    // Send rejection email (simulated)
    const rejectedUser = updatedUsers.find(u => u.id === userId);
    if (rejectedUser) {
      console.log(`Rejection email sent to ${rejectedUser.email}: We're sorry, your RoadSync account has not been approved.`);
    }
  };
  
  const getPendingUsers = () => {
    return allUsers.filter(u => u.approvalStatus === "pending");
  };

  const loadInitialData = () => {
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Load all users from localStorage
    const storedUsers = getAllUsersFromStorage();
    setAllUsers(storedUsers);
    
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
    getPendingUsers,
    loadInitialData
  };
};
