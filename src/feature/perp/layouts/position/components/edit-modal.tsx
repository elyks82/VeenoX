import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/lib/shadcn/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { triggerAlert } from "@/lib/toaster";
import { Inputs } from "@/models";
import { formatQuantity } from "@/utils/misc";
import {
  useOrderEntry,
  useOrderStream,
  useSymbolPriceRange,
  useSymbolsInfo,
} from "@orderly.network/hooks";
import { OrderEntity, OrderSide, OrderStatus } from "@orderly.network/types";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Oval } from "react-loader-spinner";

export const EditModal = () => {
  const [activePnlOrOffset, setActivePnlOrOffset] = useState("$");
  const [error, setError] = useState([""]);
  const [loading, setLoading] = useState(false);
  const {
    editPendingPositionOpen: order,
    setEditPendingPositionOpen,
    setOrderPositions,
  } = useGeneralContext();
  const [values, setValues] = useState<Inputs>({
    direction: order.side,
    type: order.type,
    triggerPrice: undefined,
    price: order.price,
    quantity: order.quantity,
    reduce_only: order.reduce_only,
    tp_trigger_price: undefined,
    sl_trigger_price: undefined,
  });

  const symbolInfo = useSymbolsInfo();
  const symbols = Object.values(symbolInfo)
    .filter((cur) => typeof cur !== "boolean")
    .map((cur) => {
      if (typeof cur === "boolean") return;
      const symbol = cur();
      return symbol;
    });
  const currentAsset = symbols?.find((cur) => cur.symbol === order?.symbol);
  const [_, { updateOrder }] = useOrderStream({
    status: OrderStatus.INCOMPLETE,
  });

  const rangeInfo = useSymbolPriceRange(order.symbol, order.side, undefined);

  const onEdit = async () => {
    setLoading(true);
    const value = getInput(values, order.symbol, currentAsset.base_tick);
    if (rangeInfo?.max && Number(values?.price) > rangeInfo?.max) {
      triggerAlert("Error", `Price should be bellow ${rangeInfo?.max}`);
      return;
    }
    if (rangeInfo?.min && Number(values?.price) < rangeInfo?.min) {
      triggerAlert("Error", `Price should be greater than ${rangeInfo?.min}`);
      return;
    }

    if (Number(values.quantity || 0) >= currentAsset?.base_max) {
      triggerAlert(
        "Error",
        `Invalid quantity. Max quantity ${currentAsset?.base_max} ${currentAsset?.symbol}`
      );
      return;
    }

    if (Number(values.quantity || 0) <= currentAsset?.base_min) {
      triggerAlert(
        "Error",
        `Invalid quantity. Min quantity ${currentAsset?.base_min} ${currentAsset?.symbol}`
      );
      return;
    }
    try {
      if (order.price !== values.price) {
        await updateOrder(order.order_id, value);
        setLoading(false);
        triggerAlert("Success", `Your position as successfully been updated`);
        setEditPendingPositionOpen(null);
        setOrderPositions([]);
      } else {
        setEditPendingPositionOpen(null);
        setLoading(false);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      triggerAlert("Error", JSON.stringify(e));
    }
  };

  return (
    <Dialog open={order}>
      <DialogContent
        close={() => setEditPendingPositionOpen(null)}
        className="max-w-[440px] w-[90%] h-auto max-h-auto flex flex-col gap-0"
      >
        <DialogHeader>
          <DialogHeader>
            <DialogTitle className="pb-5">Edit Position</DialogTitle>
          </DialogHeader>
        </DialogHeader>
        <p className="text-sm text-white mb-2 ">Price:</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex px-2.5 w-full items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className="h-full w-full"
              placeholder="Price"
              value={(values.price as any).toString()}
              onChange={(e) => {
                setValues((prev) => ({ ...prev, price: e.target.value }));
              }}
            />
          </div>
          <div className="flex pl-2.5 items-center bg-terciary border border-borderColor rounded h-[35px] text-sm">
            <input
              type="number"
              className={`h-full w-full`}
              placeholder="Loss"
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
        <div className="flex items-center w-full gap-2.5 mt-5">
          <button
            className="border-base_color border w-full rounded flex items-center justify-center h-[40px] text-sm text-white"
            onClick={onEdit}
          >
            {loading && (
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
            )}
            Edit position
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

async function getValidationErrors(
  data: Inputs,
  symbol: string,
  validator: ReturnType<typeof useOrderEntry>["helper"]["validator"],
  base_tick: number
): Promise<
  ReturnType<ReturnType<typeof useOrderEntry>["helper"]["validator"]>
> {
  return validator(getInput(data, symbol, base_tick));
}

function getInput(
  data: Inputs,
  symbol: string,
  base_tick: number
): OrderEntity {
  return {
    symbol,
    side: data.direction as OrderSide,
    order_type: data.type.toUpperCase() as any,
    order_price: isNaN(Number(data.price)) ? undefined : Number(data.price),
    order_quantity: formatQuantity(Number(data.quantity), base_tick),
    trigger_price: data.triggerPrice,
    reduce_only: data.reduce_only,
  };
}
