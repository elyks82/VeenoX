import { useMaxQty } from "@orderly.network/hooks";
import { OrderSide } from "@orderly.network/types";

export const CreateOrder = ({ asset }) => {
  const maxQty: number = useMaxQty(asset?.symbol, OrderSide.BUY);

  console.log("maxQtu", maxQty);
  return <>IEDIEIDE</>;
};
