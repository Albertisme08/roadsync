
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
