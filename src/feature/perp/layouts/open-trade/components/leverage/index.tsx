"use client";
import {
    useAccount,
    useLeverage,
    useMarginRatio,
} from "@orderly.network/hooks";
import { useRef } from "react";
import { LeverageEditor } from "./editor";

export const Leverage = () => {
  const { currentLeverage } = useMarginRatio();
  const { state } = useAccount();

  const [maxLeverage, { update, config: leverageLevers, isMutating }] =
    useLeverage();
  const nextLeverage = useRef(maxLeverage ?? 0);

  const onSave = async (value: { leverage: number }) => {
    return Promise.resolve().then(() => {
      nextLeverage.current = value.leverage;
    });
  };

  const onSubmit = async () => {
    if (nextLeverage.current === maxLeverage) return;
    if (state.status > 2) {
      try {
       await update({ leverage: nextLeverage.current });
      } catch (e) {
      }
    }
  };

  return (
    <>
      <div className="flex flex-col p-4 border-b border-borderColor">
        <p className="text-xs text-font-60 mb-1">Max account leverage</p>
        <LeverageEditor
          maxLeverage={maxLeverage}
          leverageLevers={leverageLevers}
          onSave={onSave}
          isMutating={isMutating}
          onSubmit={() => onSubmit()}
        />
      </div>
      {/* <Button
        onClick={() => {
          setOpen(false);
        }}
      >
        Cancel
      </Button>
      <Button onClick={() => onSubmit()} loading={isMutating}>
        Save
      </Button> */}
    </>
  );
};
