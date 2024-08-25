import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { triggerAlert } from "@/lib/toaster";
import { useTPSLOrder } from "@orderly.network/hooks";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Oval } from "react-loader-spinner";

export const TPSLModal = ({ order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePnlOrOffset, setActivePnlOrOffset] = useState("$");
  const [error, setError] = useState([""]);
  const [ComputedAlgoOrder, { setValue, submit, errors }] = useTPSLOrder({
    ...order,
  });

  const handleSubmit = async () => {
    if (errors) {
      for (let i = 0; i < Object.entries(errors)?.length; i++) {
        setError((prev) => [
          ...prev,
          Object.entries(errors)?.[i]?.[1]?.message,
        ]);
      }
      return;
    } else setError([""]);
    console.log("yo", errors);
    try {
      await submit();
      triggerAlert("Success", `Your TP/SL has been placed`);
    } catch (error) {
      console.error("Erreur lors de la soumission de l'ordre:", error);
    }
  };

  const handleChange = (field, value) => {
    if (error) setError([""]);
    setValue(field, value);
  };
  console.log("error", error, error?.includes("tp"));
  //   console.log("ComputedAlgoOrder", Object.entries(errors));
  return (
    <Dialog open={isOpen}>
      <DialogTrigger
      // onClick={() => {
      //   if (state.status >= 2) setOpen(true);
      //   else setIsWalletConnectorOpen(true);
      // }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2.5 rounded sm:rounded-md mr-2.5 flex items-center
        "
        >
          Deposit
        </button>
      </DialogTrigger>
      <DialogContent
        close={() => setIsOpen(false)}
        className="max-w-[440px] w-[90%] h-auto max-h-auto flex flex-col gap-0"
      >
        <DialogHeader>
          <DialogHeader>
            <DialogTitle className="pb-5">Edit TP/SL</DialogTitle>
          </DialogHeader>
        </DialogHeader>
        {/* 1. Take Profit: <br />
              USDC Level at which your order will be automatically closed for
              profit. <br /> 2. Stop Loss: <br />
              USDC Level at which your order will be automatically closed to
              limit losses. */}
        {/* <p>
          USDC Level at which your order will be automatically closed for
          profit.
        </p> */}
        <p className="text-sm text-font-80 mb-2">Take profit:</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex px-2.5 w-full items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className="h-full w-full"
              placeholder="TP Price"
              value={ComputedAlgoOrder.tp_trigger_price}
              onChange={(e) => handleChange("tp_trigger_price", e.target.value)}
            />
          </div>
          <div className="flex pl-2.5 items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className={`h-full w-full ${
                Number(ComputedAlgoOrder.tp_pnl) > 0
                  ? "text-green"
                  : Number(ComputedAlgoOrder.tp_pnl) < 0
                  ? "text-red"
                  : "text-font-80"
              }`}
              placeholder="Gain"
              value={
                activePnlOrOffset === "$"
                  ? ComputedAlgoOrder.tp_pnl
                  : (
                      Number(ComputedAlgoOrder.tp_offset_percentage) * 100
                    ).toFixed(2)
              }
              onChange={(e) =>
                handleChange(
                  activePnlOrOffset === "$" ? "tp_pnl" : "tp_offset_percentage",
                  e.target.value
                )
              }
            />
            <Popover>
              <PopoverTrigger className="h-full min-w-fit">
                <div className="w-fit px-2.5 h-full flex items-center justify-center ">
                  <p>{activePnlOrOffset}</p>
                  <IoChevronDown className="ml-1" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={0}
                className="md:transform-x-[10px] flex flex-col w-fit p-2.5  bg-secondary border border-borderColor shadow-2xl "
              >
                <button
                  onClick={() => setActivePnlOrOffset("$")}
                  className="text-sm text-white mb-1"
                >
                  $
                </button>
                <button
                  onClick={() => setActivePnlOrOffset("%")}
                  className="text-sm text-white"
                >
                  %
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && error.find((entry) => entry.includes("TP")) ? (
          <p className="text-xs text-red mt-2">
            {error.find((entry) => entry.includes("TP"))}
          </p>
        ) : null}
        <p className="text-sm text-font-80 mb-2 mt-2.5">Stop loss:</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex px-2.5 w-full items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className="h-full w-full"
              placeholder="SL Price"
              value={ComputedAlgoOrder.sl_trigger_price}
              onChange={(e) => handleChange("sl_trigger_price", e.target.value)}
            />
          </div>
          <div className="flex pl-2.5 items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className={`h-full w-full ${
                Number(ComputedAlgoOrder.sl_pnl) > 0
                  ? "text-green"
                  : Number(ComputedAlgoOrder.sl_pnl) < 0
                  ? "text-red"
                  : "text-font-80"
              }`}
              placeholder="Loss"
              value={
                activePnlOrOffset === "$"
                  ? ComputedAlgoOrder.sl_pnl
                  : (
                      Number(ComputedAlgoOrder.sl_offset_percentage) * 100
                    ).toFixed(2)
              }
              onChange={(e) =>
                handleChange(
                  activePnlOrOffset === "$" ? "sl_pnl" : "sl_offset_percentage",
                  e.target.value
                )
              }
            />
            <Popover>
              <PopoverTrigger className="h-full min-w-fit">
                <div className="w-fit px-2.5 h-full flex items-center justify-center ">
                  <p>{activePnlOrOffset}</p>
                  <IoChevronDown className="ml-1" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                sideOffset={0}
                className="md:transform-x-[10px] flex flex-col w-fit p-2.5  bg-secondary border border-borderColor shadow-2xl "
              >
                <button
                  onClick={() => setActivePnlOrOffset("$")}
                  className="text-sm text-white mb-1"
                >
                  $
                </button>
                <button
                  onClick={() => setActivePnlOrOffset("%")}
                  className="text-sm text-white"
                >
                  %
                </button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && error.find((entry) => entry.includes("SL")) ? (
          <p className="text-xs text-red mt-2">
            {error.find((entry) => entry.includes("SL"))}
          </p>
        ) : null}

        {/* Ajoutez d'autres champs pour TP, SL, etc. */}

        <button
          className="bg-base_color rounded flex items-center justify-center h-[40px] text-sm text-white mt-5"
          onClick={handleSubmit}
        >
          <Oval
            visible={true}
            height="18"
            width="18"
            color="#FFF"
            secondaryColor="rgba(255,255,255,0.6)"
            ariaLabel="oval-loading"
            strokeWidth={6}
            strokeWidthSecondary={6}
            wrapperStyle={{
              marginRight: "8px",
            }}
            wrapperClass=""
          />
          Soumettre l'ordre TP
        </button>
      </DialogContent>
    </Dialog>
  );
};
