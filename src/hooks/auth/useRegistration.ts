
import { User, UserRole, VerificationStatus, ApprovalStatus } from "@/types/auth.types";
import { 
  getAllUsersFromStorage,
  setAllUsersInStorage,
  setUserInStorage,
  isAdminEmail,
  generateVerificationToken
} from "@/utils/storage.utils";
import { toast } from "sonner";

export const useRegistration = (
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // This function simulates sending a verification email with improved feedback
  const sendVerificationEmail = (email: string, token: string) => {
    // In a real app, this would make an API call to send an email
    console.log(`[EMAIL SERVICE] Verification email sent to ${email} with token: ${token}`);
    
    // Generate a verification link that would be in the email
    const verificationLink = `${window.location.origin}/auth?token=${token}&email=${encodeURIComponent(email)}`;
    console.log(`[EMAIL SERVICE] Verification link: ${verificationLink}`);
    
    // Show more detailed toast with instructions
    toast.success(
      `Verification email sent to ${email}. Please check your inbox and spam folder.`,
      {
        description: "If you don't see the email within a few minutes, try clicking the resend button.",
        duration: 6000
      }
    );
    
    // Return a promise to simulate async behavior
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  // This function adds a test user to the system
  const addTestUser = () => {
    const testUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'shipper',
      approvalStatus: 'pending',
      businessName: 'Test Shipping Company',
      phone: '(555) 123-4567',
      description: 'A test user for demonstration purposes',
      city: 'San Francisco',
      address: '123 Test Street',
      verificationStatus: 'verified' // Make test user verified by default
    };

    const existingUsers = getAllUsersFromStorage();
    
    // Check if test user already exists
    const userExists = existingUsers.some(
      (user) => user.email.toLowerCase() === testUser.email.toLowerCase()
    );
    
    if (!userExists) {
      const updatedUsers = [...existingUsers, testUser];
      setAllUsersInStorage(updatedUsers);
      setAllUsers(updatedUsers);
      console.log("Test user added successfully:", testUser);
      return true;
    }
    
    console.log("Test user already exists");
    return false;
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // Faster registration
      
      const existingUsers = getAllUsersFromStorage() || [];
      console.log("Existing users before registration:", existingUsers.length);
      
      const existingUserIndex = existingUsers.findIndex(
        (user) => user.email.toLowerCase() === email.toLowerCase()
      );
      
      const userExists = existingUserIndex !== -1;
      const existingUser = userExists ? existingUsers[existingUserIndex] : null;
      
      // Check if user exists and account is not pending
      if (userExists && existingUser && existingUser.approvalStatus !== "pending") {
        throw new Error("User with this email already exists");
      }
      
      const isAdmin = isAdminEmail(email);
      
      // Create new user with pending status (unless admin) and verified status (bypassing email verification)
      const newUser: User = {
        id: userExists && existingUser ? existingUser.id : Math.random().toString(36).substring(2, 9),
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
        maxWeight,
        // Set verification status as verified for everyone - bypassing email verification
        verificationStatus: "verified"
      };
      
      console.log("Registering new user with data:", newUser);
      
      let updatedUsers: User[];
      
      if (userExists) {
        // Update existing user
        updatedUsers = [...existingUsers];
        updatedUsers[existingUserIndex] = newUser;
        toast.info("Your information has been updated. Your account is pending approval.");
      } else {
        // Add new user
        updatedUsers = [...existingUsers, newUser];
        toast.success("Registration successful! Your account is pending approval.");
      }
      
      // Ensure users are saved to local storage (both ways for redundancy)
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
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
        console.log(`New user registration: ${name} (${email}) - added with pending status`);
        console.log(`User added to admin dashboard under pending status`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email to user - explicitly returns Promise<string>
  const resendVerification = async (userId: string): Promise<string> => {
    const existingUsers = getAllUsersFromStorage();
    const userIndex = existingUsers.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      console.error("Failed to resend verification: User not found with ID", userId);
      throw new Error("User not found");
    }
    
    // Since we're bypassing verification, let's just mark the user as verified
    const user = existingUsers[userIndex];
    user.verificationStatus = "verified";
    
    // Update storage
    existingUsers[userIndex] = user;
    setAllUsersInStorage(existingUsers);
    setAllUsers(existingUsers);
    
    if (user.id === JSON.parse(localStorage.getItem("user") || "{}").id) {
      setUserInStorage(user);
      setUser(user);
    }
    
    toast.success("Your account is now verified.");
    console.log(`User ${user.email} marked as verified`);
    
    // Return a dummy token to satisfy the interface
    return "verified-user";
  };

  // Verify user email with token - now automatically returns true
  const verifyEmail = (token: string, email: string): boolean => {
    console.log(`Auto-verifying email for: ${email}`);
    
    const existingUsers = getAllUsersFromStorage();
    const userIndex = existingUsers.findIndex(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (userIndex === -1) {
      console.log("User not found");
      return false;
    }
    
    const user = existingUsers[userIndex];
    
    // Mark user as verified
    user.verificationStatus = "verified";
    
    // Update storage
    existingUsers[userIndex] = user;
    setAllUsersInStorage(existingUsers);
    setAllUsers(existingUsers);
    
    if (user.id === JSON.parse(localStorage.getItem("user") || "{}").id) {
      setUserInStorage(user);
      setUser(user);
    }
    
    console.log(`Email auto-verified for user: ${user.email}`);
    toast.success("Email verified successfully!");
    return true;
  };

  // This function checks if a user already exists and returns their status
  const checkExistingUser = (email: string): { exists: boolean; status?: string; user?: User } => {
    const existingUsers = getAllUsersFromStorage();
    const existingUser = existingUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingUser) {
      return { 
        exists: true, 
        status: existingUser.approvalStatus,
        user: existingUser
      };
    }
    
    return { exists: false };
  };

  return {
    register,
    sendVerificationEmail,
    addTestUser,
    checkExistingUser,
    verifyEmail,
    resendVerification
  };
};
