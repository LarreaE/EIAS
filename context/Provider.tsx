// src/context/MyProvider.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Crear el contexto
export const MyContext = createContext<any>(null);

const Provider = ({ children }: { children: ReactNode }) => {


  return (
    <MyContext.Provider
      value={{

      }}
    >
      {children}
    </MyContext.Provider>
  );
};

export default Provider;
