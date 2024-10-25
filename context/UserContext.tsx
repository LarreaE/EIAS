// context/UserContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import { Ingredients } from '../interfaces/Ingredients';
import { Player } from '../interfaces/Player';

interface UserContextType {
  userData: Player | null;
  setUserData: React.Dispatch<React.SetStateAction<Player | null>>;
  ingredients: Ingredients[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredients[]>>;
  potionVisible: boolean;
  setPotionVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isInsideLab: boolean;
  setIsInsideLab: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<Player | null>(null); // Inicializa con null o un Player por defecto
  const [ingredients, setIngredients] = useState<Ingredients[]>([]); // Estado global para ingredientes
  const [potionVisible, setPotionVisible] = useState(false);
  const [isInsideLab, setIsInsideLab] = useState(false);

  return (
    <UserContext.Provider value={{ userData, setUserData, ingredients, setIngredients,potionVisible, setPotionVisible, isInsideLab , setIsInsideLab }}>
      {children}
    </UserContext.Provider>
  );
};
