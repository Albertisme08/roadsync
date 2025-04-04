
import React, { createContext, useContext, useState, useEffect } from "react";

type UserRole = "shipper" | "driver" | "admin" | null;
type ApprovalStatus = "pending" | "approved" | "rejected";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  approveUser: (userId: string) => void;
  rejectUser: (userId: string) => void;
  getPendingUsers: () => User[];
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Make sure the AuthProvider is defined as a proper React functional component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load all users from localStorage
    const storedUsers = localStorage.getItem("allUsers");
    if (storedUsers) {
      setAllUsers(JSON.parse(storedUsers));
    }
    
    setIsLoading(false);
  }, []);

  // Mock login function (replace with actual API call in production)
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
      const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      const existingUser = existingUsers.find((u: User) => u.email === email);
      
      if (existingUser) {
        // For demo purposes, we're not checking password
        localStorage.setItem("user", JSON.stringify(existingUser));
        setUser(existingUser);
      } else {
        throw new Error("User not found");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function (replace with actual API call in production)
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
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
      };
      
      // Add to all users
      const existingUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");
      existingUsers.push(newUser);
      localStorage.setItem("allUsers", JSON.stringify(existingUsers));
      setAllUsers(existingUsers);
      
      // Set as current user
      localStorage.setItem("user", JSON.stringify(newUser));
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
    localStorage.removeItem("user");
    setUser(null);
  };
  
  const approveUser = (userId: string) => {
    const updatedUsers = allUsers.map(u => 
      u.id === userId ? { ...u, approvalStatus: "approved" as ApprovalStatus } : u
    );
    
    setAllUsers(updatedUsers);
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    
    // If the approved user is the current user, update their status
    if (user && user.id === userId) {
      const updatedUser = { ...user, approvalStatus: "approved" as ApprovalStatus };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
    
    // If the rejected user is the current user, update their status
    if (user && user.id === userId) {
      const updatedUser = { ...user, approvalStatus: "rejected" as ApprovalStatus };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
