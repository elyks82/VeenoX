import { useGeneralContext } from "@/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import { triggerAlert } from "@/lib/toaster";
import { addressSlicer, getFormattedAmount } from "@/utils/misc";
import {
  ChainsImageType,
  getImageFromChainId,
  supportedChainIds,
  supportedChains,
} from "@/utils/network";
import {
  useAccountInfo,
  useChains,
  useDeposit,
  useHoldingStream,
  useAccount as useOrderlyAccount,
  useWalletConnector,
} from "@orderly.network/hooks";
import { API } from "@orderly.network/types";
import { FixedNumber } from "ethers";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { Oval } from "react-loader-spinner";
import { useAccount, useSwitchChain } from "wagmi";
import { filterAllowedCharacters } from "./utils";

export const Deposit = () => {
  const { connectedChain } = useWalletConnector();
  const { address, chainId, chain } = useAccount();
  const { state } = useOrderlyAccount();
  const [amount, setAmount] = useState<FixedNumber>();
  const [open, setOpen] = useState(false); // Manage popup state
  const [disabled, setDisabled] = useState(true);
  const [mintedTestUSDC, setMintedTestUSDC] = useState(false);
  const [newWalletBalance, setNewWalletBalance] = useState<FixedNumber>();
  const [newOrderlyBalance, setNewOrderlyBalance] = useState<FixedNumber>();
  const [isApprovalDepositLoading, setIsApprovalDepositLoading] =
    useState<boolean>(false);
  const [isDepositSuccess, setIsDepositSuccess] = useState(false);
  const { isWalletConnectorOpen, setIsWalletConnectorOpen } =
    useGeneralContext();
  const networkIdSupported = [42161, 421614, 8453, 84532, 10, 11155420];
  const isSupportedChain = networkIdSupported.includes(chainId as number);
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
    depositFee,
    quantity,
    setQuantity,
    fetchBalance,
  } = useDeposit({
    address: token?.address,
    decimals: token?.decimals,
    srcToken: token?.symbol,
    srcChainId: Number(chainId),
  });
  const { usdc, data } = useHoldingStream();
  const { data: acc, error, isLoading } = useAccountInfo();
  const { switchChain } = useSwitchChain();

  const test = async () => {
    if (!address) return;
    await fetchBalance(address, dst.decimals);
  };

  const handleClick = async () => {
    if (isSupportedChain) {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        triggerAlert("Error", "Invalid amount.");
        return;
      }
      if (parseFloat(amount as never) > parseFloat(balance)) {
        triggerAlert("Error", "Amount exceed your holdings");
        return;
      }
      const amountNumber = Number(amount);
      const allowanceNumber = Number(allowance);

      if (allowanceNumber < amountNumber) {
        try {
          setIsApprovalDepositLoading(true);
          await approve(amount.toString());
          setIsApprovalDepositLoading(false);
        } catch (err) {
          setIsApprovalDepositLoading(false);
        }
      } else {
        setIsApprovalDepositLoading(true);
        try {
          await deposit();
          setIsDepositSuccess(true);
          setIsApprovalDepositLoading(false);
          setAmount(undefined);
          setNewWalletBalance(undefined);
          setNewOrderlyBalance(undefined);
          setTimeout(() => {
            setOpen(false);
            setTimeout(() => {
              setIsDepositSuccess(false);
            }, 1000);
          }, 3000);
        } catch (err) {
          triggerAlert("Error", "Error while depositing on Veeno.");
          setIsApprovalDepositLoading(false);
        }
      }
    } else {
      switchChain({ chainId: 42161 }); // Default switch to Arbitrum
    }
  };

  console.log("usdc", usdc, balance, dst);
  console.log("state", state);

  const chainLogo =
    supportedChains.find((entry) => entry.label === (chain?.name as string))
      ?.icon || getImageFromChainId(chainId as ChainsImageType);

  return (
    <>
      <Dialog open={open}>
        <DialogTrigger
          onClick={() => {
            if (state.status >= 2) setOpen(true);
            else setIsWalletConnectorOpen(true);
          }}
        >
          <button
            className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2.5 rounded sm:rounded-md mr-2.5 flex items-center
        "
          >
            Deposit
          </button>
        </DialogTrigger>
        <DialogContent
          close={() => setOpen(false)}
          className="w-full flex flex-col max-w-[475px] h-auto max-h-auto"
        >
          <DialogHeader>
            <DialogTitle>
              {isDepositSuccess ? "Deposit Successfull" : "Deposit on VeenoX"}
            </DialogTitle>
            <DialogDescription className="text-font-60">
              {isDepositSuccess
                ? "You deposit is in progress, your balance will update shortly."
                : "Initiate a transaction to deposit into your account from your wallet.."}
            </DialogDescription>
          </DialogHeader>
          <div className="w-full flex items-center ">
            <div className="bg-terciary h-[35px] border rounded w-full border-borderColor-DARK mr-2">
              <input
                type="text"
                readOnly
                placeholder={addressSlicer(address)}
                className="h-full px-2.5 w-full text-sm"
              />{" "}
            </div>
            <div className="bg-terciary h-[35px] border rounded border-borderColor-DARK">
              <Popover>
                <PopoverTrigger className="h-full min-w-fit">
                  <button className="h-full whitespace-nowrap text-sm px-2.5 text-white w-full flex-nowrap flex items-center justify-center">
                    <Image
                      src={chainLogo}
                      width={20}
                      height={20}
                      className="h-5 w-5 ml-2 object-cover rounded-full mr-2"
                      alt="Chain logo"
                    />
                    {chain?.name}
                    <IoChevronDown className="min-w-[18px] text-xs ml-[1px] mr-2" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  sideOffset={3}
                  className="flex flex-col px-2 py-0.5 rounded z-[102] w-fit whitespace-nowrap bg-primary border border-borderColor-DARK shadow-xl"
                >
                  {supportedChains
                    ?.filter((item) => item.network !== "testnet")
                    .map((supportedChain, i) => (
                      <button
                        key={i}
                        className="flex items-center py-1 flex-nowrap"
                        onClick={() =>
                          switchChain({
                            chainId: parseInt(supportedChain.id, 16),
                          })
                        }
                      >
                        <Image
                          src={supportedChain.icon}
                          width={20}
                          height={20}
                          className="h-5 w-5 object-cover rounded-full mr-2"
                          alt="Chain logo"
                        />
                        <p
                          className={`w-full text-start text-sm ${
                            parseInt(supportedChain.id, 16) === chainId
                              ? "text-white"
                              : "text-font-60"
                          } `}
                        >
                          {supportedChain.label}
                        </p>
                      </button>
                    ))}
                </PopoverContent>
              </Popover>{" "}
            </div>
          </div>
          <div className="bg-terciary pb-2.5 px-2.5 py-1 border mt-0 rounded w-full border-borderColor-DARK">
            <div className="w-full flex items-center justify-between">
              <input
                type="number"
                placeholder={amount?.toString() || "Quantity"}
                className="h-[30px] pr-2.5 w-full max-w-[280px] text-sm"
                onChange={(e) => {
                  const newValue = filterAllowedCharacters(e.target.value);
                  setAmount(newValue as any);
                  setQuantity(newValue.toString());
                }}
              />
              <div className="flex items-center">
                <button
                  className="text-sm font-medium text-base_color uppercase"
                  onClick={() => setAmount(balance as never)}
                >
                  MAX
                </button>
                <div className="flex items-center ml-5">
                  <Image
                    src="/assets/usdc.png"
                    width={17}
                    height={17}
                    className="object-cover rounded-full mr-1.5 -mt-0.5"
                    alt="USDC logo"
                  />
                  <p className="text-white text-sm ">USDC</p>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-between mt-1.5">
              <p className="text-font-60 text-xs ">${amount?.toString()}</p>
              <div className="flex items-center">
                <div className="flex items-center ml-5">
                  <p className="text-font-60 text-xs">
                    Available: {getFormattedAmount(balance)} USDC
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleClick}
            className={`${
              isDepositSuccess ? "bg-green" : "bg-base_color"
            } w-full h-[40px] rounded px-2.5 text-white text-sm flex items-center justify-center transition-all duration-200 ease-in-out`}
          >
            {isApprovalDepositLoading ? (
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
            ) : null}
            {isSupportedChain ? (
              <>
                {amount != null && Number(allowance) < Number(amount)
                  ? "Approve"
                  : isDepositSuccess
                  ? "Deposit Successfull"
                  : "Deposit"}
              </>
            ) : (
              "Swtich Network"
            )}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
};
