
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

  // Ensure we have the latest data from localStorage whenever the component using this hook mounts
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user is trying to login as admin
      if (role === "admin") {
        // Special handling for admin users
        if (!isAdminEmail(email)) {
          throw new Error("You don't have admin privileges");
        }
        
        // Check password for admin users
        if (password !== "Skaterboo8!") {
          throw new Error("Invalid admin password");
        }
        
        // Get existing users
        const existingUsers = getAllUsersFromStorage();
        let adminUser = existingUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        
        // If admin user doesn't exist, create one
        if (!adminUser) {
          adminUser = {
            id: Math.random().toString(36).substring(2, 9),
            email: email,
            name: "Admin User",
            role: "admin",
            approvalStatus: "approved"
          };
          
          // Add to all users
          existingUsers.push(adminUser);
          setAllUsersInStorage(existingUsers);
          setAllUsers(existingUsers);
        } else {
          // Ensure the user has admin role and is approved
          adminUser.role = "admin";
          adminUser.approvalStatus = "approved";
          
          // Update in all users
          const updatedUsers = existingUsers.map((u) =>
            u.id === adminUser!.id ? adminUser! : u
          );
          setAllUsersInStorage(updatedUsers);
          setAllUsers(updatedUsers);
        }
        
        // Set as current user
        setUserInStorage(adminUser);
        setUser(adminUser);
        setIsLoading(false);
        return;
      }
      
      // Regular login flow for non-admin users
      const existingUsers = getAllUsersFromStorage();
      const existingUser = existingUsers.find((u: User) => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        // For admin emails, always ensure admin role and approved status
        if (isAdminEmail(email)) {
          existingUser.role = "admin";
          existingUser.approvalStatus = "approved";
          
          // Update this user in all users array too
          const updatedUsers = existingUsers.map(u => 
            u.id === existingUser.id ? existingUser : u
          );
          setAllUsersInStorage(updatedUsers);
          setAllUsers(updatedUsers);
        }
        
        // Check if user is rejected
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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUsers = getAllUsersFromStorage();
      const userExists = existingUsers.some(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (userExists) {
        throw new Error("User with this email already exists");
      }
      
      // Check for admin email
      const isAdmin = isAdminEmail(email);
      
      // Create new user with pending status (unless admin)
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: isAdmin ? "admin" : role,
        approvalStatus: isAdmin ? "approved" : "pending", // Ensure non-admin users are marked as pending
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
      
      // Add to all users array
      const updatedUsers = [...existingUsers, newUser];
      
      // Make sure to persist to localStorage immediately
      setAllUsersInStorage(updatedUsers);
      
      // Update state after localStorage is updated
      setAllUsers(updatedUsers);
      
      // Set as current user
      setUserInStorage(newUser);
      setUser(newUser);
      
      // Log the state of users after registration
      const pendingUsers = updatedUsers.filter(u => u.approvalStatus === "pending");
      console.log("All users after registration:", updatedUsers.length);
      console.log("Pending users after registration:", pendingUsers.length);
      console.log("Pending users details:", pendingUsers);
      
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
    const approvalDate = Date.now(); // Current timestamp
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: "approved" as ApprovalStatus,
        approvalDate, // Add approval date timestamp
        rejectionDate: undefined // Clear any rejection date
      } : u
    );
    
    // Update localStorage first
    setAllUsersInStorage(updatedUsers);
    
    // Then update state
    setAllUsers(updatedUsers);
    
    // If the approved user is the current user, update their status
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
    
    // Send welcome email (simulated)
    const approvedUser = updatedUsers.find(u => u.id === userId);
    if (approvedUser) {
      console.log(`Welcome email sent to ${approvedUser.email}: Your account has been approved!`);
      // In a real app, this would trigger an email API call
      
      // Display user friendly notification
      if (typeof window !== 'undefined') {
        try {
          // This is just a simulation for the email notification
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
    const rejectionDate = Date.now(); // Current timestamp
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: "rejected" as ApprovalStatus,
        rejectionDate // Add rejection date timestamp
      } : u
    );
    
    // Update localStorage first
    setAllUsersInStorage(updatedUsers);
    
    // Then update state
    setAllUsers(updatedUsers);
    
    // If the rejected user is the current user, update their status
    if (user && user.id === userId) {
      const updatedUser = { 
        ...user, 
        approvalStatus: "rejected" as ApprovalStatus,
        rejectionDate
      };
      setUser(updatedUser);
      setUserInStorage(updatedUser);
    }
    
    // Send rejection email (simulated)
    const rejectedUser = updatedUsers.find(u => u.id === userId);
    if (rejectedUser) {
      console.log(`Rejection email sent to ${rejectedUser.email}: We're sorry, your RoadSync account has not been approved.`);
      // In a real app, this would trigger an email API call
    }
  };

  const restoreUser = (userId: string, newStatus: ApprovalStatus = "pending") => {
    const restorationDate = Date.now(); // Current timestamp
    
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { 
        ...u, 
        approvalStatus: newStatus,
        restorationDate, // Add restoration date timestamp
        rejectionDate: undefined, // Clear rejection date
        approvalDate: newStatus === "approved" ? restorationDate : undefined // Add approval date if restoring directly to approved
      } : u
    );
    
    // Update localStorage first
    setAllUsersInStorage(updatedUsers);
    
    // Then update state
    setAllUsers(updatedUsers);
    
    // If the restored user is the current user, update their status
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
    
    // Send restoration notification (simulated)
    const restoredUser = updatedUsers.find(u => u.id === userId);
    if (restoredUser) {
      const statusMessage = newStatus === "approved" 
        ? "Your account has been restored and approved. You can now use all platform features."
        : "Your account has been restored and is pending review.";
        
      console.log(`Restoration email sent to ${restoredUser.email}: ${statusMessage}`);
      // In a real app, this would trigger an email API call
    }
  };
  
  const getPendingUsers = () => {
    // Always get fresh data from storage
    const allStorageUsers = getAllUsersFromStorage();
    const pendingUsers = allStorageUsers.filter(u => u.approvalStatus === "pending");
    console.log(`Getting pending users: found ${pendingUsers.length} pending users`);
    return pendingUsers;
  };

  const loadInitialData = () => {
    // Get fresh data from localStorage
    const storedUsers = getAllUsersFromStorage();
    console.log("Loading users from storage:", storedUsers.length);
    
    const pendingUsers = storedUsers.filter(u => u.approvalStatus === "pending");
    console.log("Pending users in storage:", pendingUsers.length);
    
    if (pendingUsers.length > 0) {
      console.log("Pending users details:", pendingUsers);
    }
    
    // Update state with the fresh data
    setAllUsers(storedUsers);
    
    // Get current user from storage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      // Ensure admin users always have admin role
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
