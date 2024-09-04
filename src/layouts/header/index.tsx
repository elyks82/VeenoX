"use client";
import CryptoFearAndGreedChart from "@/components/fear-greed";
import { Tooltip as CustomTooltip } from "@/components/tooltip";
import { useGeneralContext } from "@/context";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/shadcn/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/lib/shadcn/tooltip";
import {
  ChainsImageType,
  getImageFromChainId,
  supportedChains,
} from "@/utils/network";
import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAccount, useConnect, useSwitchChain } from "wagmi";
import { Deposit } from "../deposit";
import { EnableTrading } from "../enable-trading";
import { ConnectWallet } from "../wallet-connect";
import { MobileModal } from "./mobile";

export enum AccountStatusEnum {
  NotConnected = 0,
  Connected = 1,
  NotSignedIn = 2,
  SignedIn = 3,
  DisabledTrading = 4,
  EnableTrading = 5,
}

export const Header = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { account, state } = useOrderlyAccount();
  const { address, isDisconnected, isConnecting, chain, chainId, isConnected } =
    useAccount();
  const { connect, connectors } = useConnect();
  const { isEnableTradingModalOpen, setIsEnableTradingModalOpen } =
    useGeneralContext();
  // useEffect(() => {
  //   if (isConnected && address) {
  //     account.setAddress(address, {
  //       provider: window.ethereum,
  //       chain: {
  //         id: "0x1",
  //       },
  //       wallet: {
  //         name: "Web3Modal",
  //       },
  //     });
  //   }
  // }, [isConnected, address, account]);

  // const provider = useProvider();
  // const { chain } = useNetwork();

  // async function connectWallet() {
  //   try {
  //     await connect({ connector: connectors[0] }); // assuming MetaMask connector
  //     const walletProvider = provider.provider;
  //     const chainInfo = {
  //       id: `0x${chain.id.toString(16)}`,
  //     };
  //     const walletInfo = {
  //       name: "MetaMask", // or any other wallet
  //     };

  //     const nextState = await account.setAddress(address, {
  //       provider: walletProvider,
  //       chain: chainInfo,
  //       wallet: walletInfo,
  //     });

  //     console.log("Next State:", nextState);
  //   } catch (error) {
  //     console.error("Failed to connect wallet:", error);
  //   }
  // }

  // const handleAccountCreation = async () => {
  //   const nextState = await account.setAddress("<address>", {
  //     provider: "provider", // EIP1193Provider, usually window.ethereum
  //     chain: {
  //       id: "0x1", // chain id, e.g. 0x1 for Ethereum Mainnet, it's a hex string
  //     },
  //     wallet: {
  //       name: "", // Wallet app name, e.g. MetaMask
  //     },
  //   });
  // };

  // const handleDisconnect = () => {
  //   disconnect();
  // };

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { switchChain } = useSwitchChain();
  const { isDeposit } = useGeneralContext();
  console.log("chainId", chainId);
  const chainLogo =
    supportedChains.find((entry) => entry.label === (chain?.name as string))
      ?.icon || getImageFromChainId(chainId as ChainsImageType);

  console.log("chainLogo", chainLogo);
  return (
    <header className="flex items-center justify-between h-[60px] px-2.5 border-b border-borderColor">
      <div className="flex items-center gap-5">
        <Link href="/">
          <div className="flex items-center gap-2">
            <img
              src="/veenox/veenox-text.png"
              alt="Veeno Logo"
              className="h-[30px] w-auto max-w-auto max-h-[25px] sm:max-w-auto sm:max-h-[30px]"
            />

            <nav className="ml-5 h-full hidden lg:flex">
              <ul className="text-white text-medium text-sm flex items-center gap-5 h-full">
                <li>Trade</li>
                <li>Dashboard</li>
                <li>Portfolio</li>
                <li>Swap</li>
                <li>Learn Trading & Earn</li>
              </ul>
            </nav>
          </div>{" "}
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex relative w-fit h-fit">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <div className="w-full h-[38px] -mt-2.5 mr-2">
                  <CryptoFearAndGreedChart
                    fearLevel={50}
                    fearClassification={"Greed"}
                  />{" "}
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="h-fit text-white overflow-clip max-w-[220px] w-full p-2 bg-secondary border border-borderColor shadow-xl whitespace-pre-wrap"
              >
                The Fear & Greed Index measures investor sentiment, indicating
                whether the market is driven by fear (selling pressure) or greed
                (buying enthusiasm)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Deposit />

          {/* {supportedChains
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
                ></button> */}
          <Popover>
            <PopoverTrigger className="h-full min-w-fit">
              <button
                className="text-white bg-secondary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2 rounded sm:rounded-md mr-2.5 flex items-center
        "
              >
                <Image
                  src={chainLogo}
                  width={20}
                  height={20}
                  className="object-cover rounded-full"
                  alt="Chain logo"
                />
                <IoChevronDown className="ml-1" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              sideOffset={3}
              className="flex flex-col px-3 py-2 rounded z-[102] w-fit whitespace-nowrap bg-secondary border border-borderColor shadow-xl"
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
                      width={18}
                      height={18}
                      className="h-5 w-5 object-cover rounded-full mr-2"
                      alt="Chain logo"
                    />
                    <p
                      className={`w-full text-start font-medium text-[13px] ${
                        parseInt(supportedChain.id, 16) === chainId
                          ? "text-white"
                          : "text-font-60"
                      } `}
                    >
                      {supportedChain.label === "OP Mainnet"
                        ? "Optimism"
                        : supportedChain.label}
                    </p>
                  </button>
                ))}
            </PopoverContent>
          </Popover>
          <ConnectWallet />
          {/* {!isDisconnected ? ( */}
          <CustomTooltip isOpen={isTooltipOpen}>
            <div className="flex items-center  text-sm" onClick={handleCopy}>
              {/* <p>{addressSlicer(address)}</p> */}
              <button className="ml-2 ">
                {isCopied ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <MdContentCopy className="text-white" />
                )}
              </button>
            </div>
            <button
              className="text-white text-bold font-poppins text-sm mt-2"
              // onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </CustomTooltip>
          <button
            className="lg:hidden flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <RxHamburgerMenu className="text-white ml-3 text-xl" />
          </button>
          {/* ) : null} */}
        </div>
      </div>

      <MobileModal
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen((prev) => !prev)}
      />
      <EnableTrading />
    </header>
  );
};
