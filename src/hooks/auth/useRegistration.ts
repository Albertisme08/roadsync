
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
  // Removed email verification functionality as it's no longer needed
  const sendVerificationEmail = (email: string, token: string) => {
    // Simply log that verification is bypassed
    console.log(`[EMAIL VERIFICATION BYPASSED] New user registered: ${email}`);
    
    // Show toast notification about account creation
    toast.success(
      `Account created successfully! Your account is pending admin approval.`,
      {
        duration: 6000
      }
    );
    
    // Return a promise to simulate async behavior
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  // This function adds a test user to the system
  const addTestUser = () => {
    const testUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'shipper',
      approvalStatus: 'pending', // Set test users to pending approval
      businessName: 'Test Shipping Company',
      phone: '(555) 123-4567',
      description: 'A test user for demonstration purposes',
      city: 'San Francisco',
      address: '123 Test Street',
      verificationStatus: 'verified' // All users are auto-verified
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
      if (userExists && existingUser && existingUser.approvalStatus === "approved") {
        throw new Error("User with this email already exists");
      }
      
      const isAdmin = isAdminEmail(email);
      
      // Create new user with pending status by default (admins are auto-approved)
      const newUser: User = {
        id: userExists && existingUser ? existingUser.id : Math.random().toString(36).substring(2, 9),
        email,
        name,
        role: isAdmin ? "admin" : role,
        approvalStatus: isAdmin ? "approved" : "pending", // Auto-approve only admins
        businessName,
        dotNumber,
        mcNumber,
        phone,
        description,
        city,
        address,
        equipmentType,
        maxWeight,
        // Auto-verify all users
        verificationStatus: "verified",
        registrationDate: Date.now() // Add registration timestamp for tracking
      };
      
      console.log("Registering new user with data:", newUser);
      
      let updatedUsers: User[];
      
      if (userExists) {
        // Update existing user
        updatedUsers = [...existingUsers];
        updatedUsers[existingUserIndex] = newUser;
        if (isAdmin) {
          toast.success("Your account has been updated and is ready to use.");
        } else {
          toast.success("Your account has been updated and is pending approval.");
        }
      } else {
        // Add new user
        updatedUsers = [...existingUsers, newUser];
        if (isAdmin) {
          toast.success("Registration successful! You can now log in to your account.");
        } else {
          toast.success("Registration successful! Your account is pending admin approval.");
        }
      }
      
      // Ensure users are saved to local storage (both ways for redundancy)
      localStorage.setItem("allUsers", JSON.stringify(updatedUsers));
      setAllUsersInStorage(updatedUsers);
      setAllUsers(updatedUsers);
      
      setUserInStorage(newUser);
      setUser(newUser);
      
      console.log("All users after registration:", updatedUsers.length);
      console.log("User registered and automatically approved:", newUser);
      
      if (isAdmin) {
        console.log(`Welcome email sent to admin: ${email}`);
      } else {
        console.log(`New user registration: ${name} (${email}) - added with pending status`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Simplified resendVerification - no longer needed but kept for compatibility
  const resendVerification = async (userId: string): Promise<string> => {
    // This function is now essentially a no-op since all users are auto-verified
    console.log("Verification resend requested but not needed - all users are auto-verified");
    return "verified-user";
  };

  // Simplified verifyEmail - no longer needed but kept for compatibility
  const verifyEmail = (token: string, email: string): boolean => {
    console.log("Verification check bypassed - all users are auto-verified");
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
