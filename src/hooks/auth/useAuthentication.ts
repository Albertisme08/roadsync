
import { User, UserRole } from "@/types/auth.types";
import { 
  setUserInStorage, 
  removeUserFromStorage,
  getAllUsersFromStorage,
  setAllUsersInStorage,
  isAdminEmail
} from "@/utils/storage.utils";

export const useAuthentication = (
  user: User | null,
  setUser: (user: User | null) => void,
  setAllUsers: (users: User[]) => void,
  setIsLoading: (isLoading: boolean) => void
) => {
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

  const logout = () => {
    removeUserFromStorage();
    setUser(null);
  };

  return {
    login,
    logout
  };
};
