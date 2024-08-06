"use client";
import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

interface GeneralContextProps {
  prevPrice: number;
  setPrevPrice: Dispatch<SetStateAction<number>>;
  isPriceChanged: boolean;
  setIsPriceChanged: Dispatch<SetStateAction<boolean>>;
}

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider: FC<PropsWithChildren> = ({ children }) => {
  const [prevPrice, setPrevPrice] = useState(0);
  const [isPriceChanged, setIsPriceChanged] = useState(false);

  const value = useMemo(
    () => ({
      prevPrice,
      setPrevPrice,
      isPriceChanged,
      setIsPriceChanged,
    }),
    [isPriceChanged, prevPrice]
  );

  return (
    <GeneralContext.Provider value={value}>{children}</GeneralContext.Provider>
  );
};
