"use client";
import { triggerAlert } from "@/lib/toaster";
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

  const onSubmit = () => {
    if (nextLeverage.current === maxLeverage) return;
    update({ leverage: nextLeverage.current }).then(
      () => {
        triggerAlert("Success", "Max leverage has been updated successfully");
      },
      () => {
        triggerAlert("Error", "Error whild updating max leverage");
      }
    );
  };

  return (
    <>
      <div className="flex flex-col p-4 border-b border-borderColor">
        <p className="text-xs text-font-60 mb-1">Max account leverage</p>
        <LeverageEditor
          maxLeverage={maxLeverage}
          leverageLevers={leverageLevers}
          onSave={onSave}
        />
        <button onClick={onSubmit}>
          {isMutating ? "Loading" : `current: ${currentLeverage}`}
        </button>
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
