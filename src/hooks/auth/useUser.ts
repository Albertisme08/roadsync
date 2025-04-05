
import { useState } from "react";
import { User } from "@/types/auth.types";
import { getUserFromStorage, getAllUsersFromStorage } from "@/utils/storage.utils";

export const useUser = () => {
  const [user, setUser] = useState<User | null>(getUserFromStorage());
  const [allUsers, setAllUsers] = useState<User[]>(getAllUsersFromStorage());
  const [isLoading, setIsLoading] = useState(true);

  return {
    user,
    allUsers,
    setUser,
    setAllUsers,
    isLoading,
    setIsLoading
  };
};
