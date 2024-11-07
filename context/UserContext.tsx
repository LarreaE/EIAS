import React, { createContext, useState, ReactNode } from 'react';
import { Ingredients } from '../interfaces/Ingredients';
import { Player } from '../interfaces/Player';
import Curse from '../components/Potions/Curse';

export interface UserContextType {
  userData: any | null;
  setUserData: React.Dispatch<React.SetStateAction<Player | null>>;
  ingredients: Ingredients[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredients[]>>;
  potionVisible: boolean;
  setPotionVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isInsideLab: boolean;
  setIsInsideLab: React.Dispatch<React.SetStateAction<boolean>>;
  parchment: boolean;
  setParchment: React.Dispatch<React.SetStateAction<boolean>>;
  purifyIngredients: Ingredients[];
  setPurifyIngredients: React.Dispatch<React.SetStateAction<Ingredients[]>>;
  allIngredients: Ingredients[];
  setAllIngredients: React.Dispatch<React.SetStateAction<Ingredients[]>>;
  curses: Curse[];
  setCurses: React.Dispatch<React.SetStateAction<Curse[]>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<Player | null>(null);
  const [ingredients, setIngredients] = useState<Ingredients[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [curses, setCurses] = useState<Curse[]>([]);

  const [potionVisible, setPotionVisible] = useState(false);
  const [isInsideLab, setIsInsideLab] = useState(false);
  const [parchment, setParchment] = useState(false);
  const [purifyIngredients, setPurifyIngredients] = useState<Ingredients[]>([]);

  return (
    <UserContext.Provider value={{
      userData, setUserData,
      ingredients, setIngredients,
      potionVisible, setPotionVisible,
      isInsideLab, setIsInsideLab,
      parchment, setParchment,
      purifyIngredients, setPurifyIngredients,
      allIngredients, setAllIngredients,
      curses, setCurses
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
