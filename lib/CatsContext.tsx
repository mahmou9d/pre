"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CatsContextType = {
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CatsContext = createContext<CatsContextType | undefined>(undefined);

export const CatsProvider = ({ children }: { children: ReactNode }) => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CatsContext.Provider value={{ cartOpen, setCartOpen }}>
      {children}
    </CatsContext.Provider>
  );
};

export const useCats = () => {
  const context = useContext(CatsContext);

  if (!context) {
    throw new Error("useCats must be used inside CatsProvider");
  }

  return context;
};
