import React, { createContext, useState, ReactNode } from 'react';
import { Ingredients } from '../interfaces/Ingredients';
import { Player } from '../interfaces/Player';
import Curse from '../components/Potions/Curse';
import { Locations } from '../interfaces/Location';

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
  currentScreen: string;
  setCurrentScreen: React.Dispatch<React.SetStateAction<string>>;
  player: Player | null;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  artifacts: any | [];
  setArtifacts: React.Dispatch<React.SetStateAction<any | null>>;
  otherAcolytes: Locations[];
  setOtherAcolytes: React.Dispatch<React.SetStateAction<Locations[]>>
  isHallInNeedOfMortimer: boolean;
  setIsHallInNeedOfMortimer: React.Dispatch<React.SetStateAction<boolean>>;


}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<Player | null>(null);
  const [ingredients, setIngredients] = useState<Ingredients[]>([]);
  const [allIngredients, setAllIngredients] = useState<Ingredients[]>([]);
  const [curses, setCurses] = useState<Curse[]>([]);
  const [currentScreen, setCurrentScreen] = useState('Home'); // Default starting screen name
  const [potionVisible, setPotionVisible] = useState(false);
  const [isInsideLab, setIsInsideLab] = useState(false);
  const [parchment, setParchment] = useState(false);
  const [purifyIngredients, setPurifyIngredients] = useState<Ingredients[]>([]);
  const [player, setPlayer] = useState<Player | null>(null);
  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [otherAcolytes, setOtherAcolytes] = useState<Locations[]>([]);
  const [isHallInNeedOfMortimer, setIsHallInNeedOfMortimer] = useState(false);

  return (
    <UserContext.Provider value={{
      userData, setUserData,
      ingredients, setIngredients,
      potionVisible, setPotionVisible,
      isInsideLab, setIsInsideLab,
      parchment, setParchment,
      purifyIngredients, setPurifyIngredients,
      allIngredients, setAllIngredients,
      curses, setCurses,
      currentScreen, setCurrentScreen,
      player, setPlayer,
      otherAcolytes, setOtherAcolytes,
      artifacts,setArtifacts,
      isHallInNeedOfMortimer,setIsHallInNeedOfMortimer,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
