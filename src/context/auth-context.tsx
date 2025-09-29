import Admin from "@/models/admin";
import Merchant from "@/models/merchant";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface UserContextType {
  userDetails: Admin | Merchant | null;
  setLoadig: (loading: boolean) => void;
  loading: boolean;
  setUser: (details: Admin | Merchant | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useAuthStore = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: PropsWithChildren) => {
  const [userDetails, setUser] = useState<Admin | Merchant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateUser = (details: Admin | Merchant | null) => {
    setIsLoading(false);
    setUser(details);
  };

  const value: UserContextType = {
    userDetails,
    setLoadig: setIsLoading,
    setUser: updateUser,
    loading: isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
