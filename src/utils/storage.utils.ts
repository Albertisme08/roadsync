
import { User } from "../types/auth.types";

export const getUserFromStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const setUserInStorage = (user: User): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem("user");
};

export const getAllUsersFromStorage = (): User[] => {
  const storedUsers = localStorage.getItem("allUsers");
  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const setAllUsersInStorage = (users: User[]): void => {
  localStorage.setItem("allUsers", JSON.stringify(users));
};

export const isAdminEmail = (email: string): boolean => {
  const adminEmails = ["alopezcargo@outlook.com", "fwdfwdit@gmail.com"];
  return adminEmails.includes(email.toLowerCase());
};

// Function to seed admin users if they don't exist
export const seedAdminUsers = (): void => {
  const existingUsers = getAllUsersFromStorage();
  const adminEmails = ["alopezcargo@outlook.com", "fwdfwdit@gmail.com"];
  
  // Check if admin users already exist
  const adminExists = adminEmails.every(email => 
    existingUsers.some(user => user.email.toLowerCase() === email.toLowerCase())
  );
  
  // If admin users don't exist, create them
  if (!adminExists) {
    const adminUsers: User[] = adminEmails.map(email => ({
      id: Math.random().toString(36).substring(2, 9),
      email: email,
      name: "Admin User",
      role: "admin",
      approvalStatus: "approved",
      verificationStatus: "verified" // Admins are auto-verified
    }));
    
    // Add admin users to existing users
    const updatedUsers = [...existingUsers, ...adminUsers];
    setAllUsersInStorage(updatedUsers);
    console.log("Admin users seeded successfully");
  }
};

// Generate a random verification token
export const generateVerificationToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
