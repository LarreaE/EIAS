// context/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

interface UserContextType {
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<any>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};
