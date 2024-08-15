"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/shadcn/dialog";
import { addressSlicer } from "@/utils/misc";
import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import { useEffect, useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { TfiWallet } from "react-icons/tfi";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { getActiveStep } from "./constant";

export enum AccountStatusEnum {
  NotConnected = 0,
  Connected = 1,
  NotSignedIn = 2,
  SignedIn = 3,
  DisabledTrading = 4,
  EnableTrading = 5,
}

export const ConnectWallet = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { account, state, createOrderlyKey, createAccount } =
    useOrderlyAccount();
  const { address, isDisconnected, isConnecting } = useAccount();
  const [isVisible, setIsVisible] = useState(true);
  const [status, setStatus] = useState("idle");
  const [isActive, setIsActive] = useState(0);
  const { connect, connectors, isPending, isError, isSuccess, data } =
    useConnect();
  const { chains, switchChain } = useSwitchChain();
  const { isConnected } = useAccount();

  // useEffect(() => {
  //   if (!data?.chainId) return;

  //   // Changer de chaîne si nécessaire
  //   const switchChain = async () => {
  //     try {
  //       await switchChain(data?.chainId);
  //       console.log(`Switched to chain ${data?.chainId}`);
  //     } catch (error) {
  //       console.log(`Failed to switch chain: `);
  //     }
  //   };

  //   if (isConnected) {
  //     switchChain();
  //   }
  // }, [data?.chainId, isConnected, switchChain]);

  const statusChangeHandler = (nextState: any) => {
    console.log("nextState", nextState);
  };

  useEffect(() => {
    if (isSuccess && address) {
      const setAccount = async () => {
        try {
          const provider = await connectors[isActive - 1]?.getProvider();
          const nextState = await account.setAddress(address, {
            provider,
            chain: {
              id: data?.chainId,
            },
          });
          console.log("const nextState =", nextState);
        } catch (e) {
          console.log("error", e);
        }
      };
      setAccount();
    }
  }, [isSuccess, address, account]);

  const handleCreateAccount = async () => {
    try {
      const resp = await createAccount();
      console.log("ressssssss", resp); // RETURN undefined
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleEnableTrading = async () => {
    try {
      const resp = await createOrderlyKey(true);
      console.log("ressssssss", resp); // RETURN undefined
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleConnect = (i: number) => {
    connect({ connector: connectors[i] });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const getImageFromConnector = (
    name: string,
    image: string
  ): string | null => {
    if (name === "Injected") return null;
    else if (name === "Coinbase Wallet") return "/logo/coinbase.png";
    else return image;
  };

  const getConnectorsToShow = (name: string) => {
    switch (name) {
      case "WalletConnect":
        return false;
      case "Web3Modal Auth":
        return false;
      case "SubWallet":
        return false;
      case "Keplr":
        return false;
      default:
        return true;
    }
  };

  return (
    <div className="w-fit h-fit relative">
      <button
        className="h-10 w-10 bg-red"
        onClick={() => handleCreateAccount()}
      >
        Create Account
      </button>
      <button
        className="bg-green text-white"
        onClick={() => handleEnableTrading()}
      >
        Enable trading
      </button>
      <Dialog>
        <DialogTrigger>
          <div
            className="text-white bg-base_color border border-borderColor-DARK text-bold font-poppins text-xs
        h-[30px] sm:h-[35px] px-2 sm:px-2.5 rounded sm:rounded-md 
        "
          >
            {isDisconnected || isConnecting ? (
              "Connect"
            ) : (
              <span className="inline-flex items-center">
                <p>{addressSlicer(address)}</p>
                <IoChevronDown className="ml-1" />
              </span>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="w-full flex flex-col max-w-[475px] h-auto max-h-auto">
          <DialogHeader>
            <DialogTitle>{getActiveStep(status).title}</DialogTitle>
            <DialogDescription className="text-font-60">
              {getActiveStep(status).description}
            </DialogDescription>
          </DialogHeader>
          {status === "idle" || status === "error" ? (
            <div className="flex flex-wrap gap-2 w-full items-center">
              {connectors?.map((connector, i) => {
                const image = getImageFromConnector(
                  connector.name,
                  connector.icon as string
                );
                const includeWallet = connector.name.includes("Wallet");
                const formatName = includeWallet
                  ? connector.name.split(" Wallet")[0]
                  : connector.name;
                const isToRender = getConnectorsToShow(connector.name);
                if (isToRender)
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        handleConnect(i);
                        setIsActive(i + 1);
                      }}
                      className={`w-[100px] h-[100px] hover:bg-base_color ${
                        isActive === i + 1 ? "bg-base_color" : "bg-terciary"
                      } transition-all duration-200 ease-in-out rounded border border-borderColor
                     flex items-center flex-col justify-center`}
                    >
                      {image ? (
                        <img
                          src={image}
                          height={40}
                          width={40}
                          className="rounded"
                        />
                      ) : (
                        <TfiWallet className="text-4xl text-white" />
                      )}
                      <p className="text-white text-xs mt-2.5">{formatName}</p>
                    </button>
                  );
                return null;
              })}
            </div>
          ) : (
            <div className="h-[208px] w-full flex flex-col items-center justify-center">
              {getImageFromConnector(
                connectors[isActive - 1].name,
                connectors[isActive - 1].icon as string
              ) ? (
                <img
                  src={
                    getImageFromConnector(
                      connectors[isActive - 1].name,
                      connectors[isActive - 1].icon as string
                    ) as string
                  }
                  height={80}
                  width={80}
                  className="rounded-full animate-pulse-scale"
                />
              ) : (
                <TfiWallet className="text-6xl text-white animate-pulse-scale shadow-xl shadow-slate-800" />
              )}
              <p className="text-white text-sm mt-5">
                {`Connecting to ${connectors[isActive - 1].name}`}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
