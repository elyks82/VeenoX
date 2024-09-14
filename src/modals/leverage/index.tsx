"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { useLeverage, useMarginRatio } from "@orderly.network/hooks";
import { useRef } from "react";
import { toast } from "react-toastify";
import { LeverageEditor } from "./editor";

export const Leverage = () => {
  const { currentLeverage } = useMarginRatio();
  const [maxLeverage, { update, config: leverageLevers, isMutating }] =
    useLeverage();
  const nextLeverage = useRef(maxLeverage ?? 0);

  const onSave = async (value: { leverage: number }) => {
    const id = toast.loading("Please wait...");
    if (value.leverage === maxLeverage) return;

    update({ leverage: value.leverage }).then(
      () => {
        toast.update(id, {
          render: "Max leverage updated",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      },
      (error: { message: string }) => {
        toast.update(id, {
          render: <p className="mb-1">{error.message}</p>,
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    );
    return Promise.resolve().then(() => {
      nextLeverage.current = value.leverage;
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <button className="text-white">YO BROROROROGOOR</button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[450px] w-[90%] h-auto max-h-[90vh] flex flex-col gap-0 overflow-auto no-scrollbar"
        close={() => {}}
      >
        <DialogHeader className="text-xl">Edit Max Leverage</DialogHeader>
        <div className="flex flex-col mt-5">
          <p className="text-xs text-font-60 mb-1">
            Note that setting a higher leverage increases the risk of
            liquidation.
          </p>
          <LeverageEditor
            maxLeverage={maxLeverage}
            leverageLevers={leverageLevers}
            onSave={onSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
