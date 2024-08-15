import { getFormattedAmount } from "@/utils/misc";
import { supportedChainIds } from "@/utils/network";
import {
  useChains,
  useDeposit,
  useWalletConnector,
} from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { FixedNumber } from "ethers";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { filterAllowedCharacters } from "./utils";

export const Deposit = () => {
  const { connectedChain } = useWalletConnector();
  const { address, chainId, chain } = useAccount();
  const [amount, setAmount] = useState<FixedNumber>();
  const [open, setOpen] = useState(false); // Manage popup state
  const [disabled, setDisabled] = useState(true);
  const [mintedTestUSDC, setMintedTestUSDC] = useState(false);
  const [newWalletBalance, setNewWalletBalance] = useState<FixedNumber>();
  const [newOrderlyBalance, setNewOrderlyBalance] = useState<FixedNumber>();

  const [chains] = useChains("mainnet", {
    filter: (item: API.Chain) =>
      supportedChainIds.includes(item.network_infos?.chain_id),
  });

  const token = useMemo(() => {
    return Array.isArray(chains)
      ? chains
          .find((chain) => chain.network_infos.chain_id === chainId)
          ?.token_infos.find((t) => t.symbol === "USDC")
      : undefined;
  }, [chains, connectedChain]);

  const {
    dst,
    balance,
    allowance,
    approve,
    deposit,
    isNativeToken,
    balanceRevalidating,
    fetchBalance,
  } = useDeposit({
    address: token?.address,
    decimals: token?.decimals,
    srcToken: token?.symbol,
    srcChainId: Number(chainId),
  });

  const handleClick = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      console.error("Invalid amount entered");
      return; // Early exit if the amount is invalid
    }
    const amountNumber = Number(amount);
    const allowanceNumber = Number(allowance);
    console.log(
      "Number(allowance) < amountNumber",
      Number(allowance) < amountNumber
    );
    console.log(
      "allowance",
      Number(getFormattedAmount(allowance)),
      amountNumber
    );
    if (allowanceNumber < amountNumber) {
      setOpen(true);

      try {
        await approve(amount.toString());
        console.log("Approval successful");
      } catch (err) {
        console.error("Approval failed:", err);
      }
    } else {
      console.log("Depositing");
      try {
        //   await deposit();
        setAmount(undefined);
        setNewWalletBalance(undefined);
        setNewOrderlyBalance(undefined);
      } catch (err) {
        console.error("Deposit failed:", err);
      }
    }
  };

  return (
    <div className="bg-purple-900 p-5">
      <input
        type="number"
        onChange={(e) => {
          let newValue = filterAllowedCharacters(e.target.value);
          setAmount(newValue as any);
        }}
        // value={amount}
        className="bg-white h-[40px] w-[200px] px-2.5"
      />
      <p> Amount === {amount?.toString() || "20202002"}</p>
      <button
        onClick={handleClick}
        className="bg-purple-400 h-[40px] w-fit px-2.5 text-white text-sm"
      >
        {amount != null && Number(allowance) < Number(amount)
          ? "Approve"
          : "Deposit"}
      </button>

      {/* Modal Component for Approval */}
      {open && (
        <div onClick={() => setOpen(false)}>
          <div className="p-4">
            <p>Approval needed to proceed with the deposit.</p>
            <p>Please approve the transaction in your wallet.</p>
            <button
              onClick={() => setOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
