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

type TradeInfo = {
  type: string;
  side: string;
  size: number;
  price: number | null;
  reduce_only: boolean;
  tp_sl: boolean;
  tp: number | null;
  sl: number | null;
  leverage: number;
};

interface GeneralContextProps {
  showMobileTradeCreator: boolean;
  setShowMobileTradeCreator: Dispatch<SetStateAction<boolean>>;
  tradeInfo: TradeInfo;
  setTradeInfo: Dispatch<SetStateAction<TradeInfo>>;
}

const INITIAL_TRADE_INFO = {
  type: "Market",
  side: "Buy",
  size: 100, // Percentage
  price: 0,
  reduce_only: false,
  tp_sl: false,
  tp: 0,
  sl: 0,
  leverage: 1,
};

export const GeneralContext = React.createContext({} as GeneralContextProps);

export const useGeneralContext = () => useContext(GeneralContext);

export const GeneralProvider: FC<PropsWithChildren> = ({ children }) => {
  const [showMobileTradeCreator, setShowMobileTradeCreator] = useState(false);
  const [tradeInfo, setTradeInfo] = useState(INITIAL_TRADE_INFO);

  const value = useMemo(
    () => ({
      showMobileTradeCreator,
      setShowMobileTradeCreator,
      tradeInfo,
      setTradeInfo,
    }),
    [showMobileTradeCreator, tradeInfo]
  );

  return (
    <GeneralContext.Provider value={value as any}>
      {children}
    </GeneralContext.Provider>
  );
};
