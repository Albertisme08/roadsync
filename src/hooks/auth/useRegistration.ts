
import { User, UserRole } from "@/types/auth.types";
import { 
  getAllUsersFromStorage,
  setAllUsersInStorage,
  setUserInStorage,
  isAdminEmail
} from "@/utils/storage.utils";
import { toast } from "sonner";

export const useRegistration = (
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
  // This function simulates sending a verification email
  const sendVerificationEmail = (email: string, token: string) => {
    // In a real app, this would make an API call to send an email
    console.log(`[EMAIL SERVICE] Verification email sent to ${email} with token: ${token}`);
    console.log(`[EMAIL SERVICE] Verification link: https://yourdomain.com/verify?token=${token}&email=${email}`);
    
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
      address: '123 Test Street'
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const existingUsers = getAllUsersFromStorage();
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
      
      // Create new user with pending status (unless admin)
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
        maxWeight
      };
      
      console.log("Registering new user with data:", newUser);
      
      let updatedUsers: User[];
      
      if (userExists) {
        // Update existing user
        updatedUsers = [...existingUsers];
        updatedUsers[existingUserIndex] = newUser;
        toast.info("Your information has been updated. Your account is still pending approval.");
      } else {
        // Add new user
        updatedUsers = [...existingUsers, newUser];
        toast.info("Registration successful. Your account is pending approval.");
      }
      
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
    checkExistingUser
  };
};
