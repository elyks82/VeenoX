import {
  useAccount,
  useLeverage,
  useMarginRatio,
} from "@orderly.network/hooks";
import { Button } from "@radix-ui/themes";
import { FC, PropsWithChildren, useRef, useState } from "react";
import { LeverageEditor } from "./editor";

export const LeverageDialog: FC<PropsWithChildren> = (props) => {
  const [open, setOpen] = useState(false);
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
        const resp = await update({ leverage: nextLeverage.current });
        console.log("resp", resp);
      } catch (e) {
        console.log("e", e);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col text-font-80">
        <div className="flex gap-1">
          <span className="flex-1">Current:</span>
          <span>{maxLeverage}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="flex-1">Max account leverage</span>
          <div className="my-5 h-[80px]">
            <LeverageEditor
              maxLeverage={maxLeverage}
              leverageLevers={leverageLevers}
              onSave={onSave}
            />
          </div>
        </div>
      </div>
      <Button
        onClick={() => {
          setOpen(false);
        }}
      >
        Cancel
      </Button>
      <Button onClick={() => onSubmit()} loading={isMutating}>
        Save
      </Button>
    </>
  );
};
