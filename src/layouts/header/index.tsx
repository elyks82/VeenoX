"use client";
import { Tooltip } from "@/components/tooltip";
import { useAccount as useOrderlyAccount } from "@orderly.network/hooks";
import Link from "next/link";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAccount, useConnect } from "wagmi";
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
  const { address, isDisconnected, isConnecting, chain, isConnected } =
    useAccount();
  const { connect, connectors } = useConnect();
  console.log("state", state);
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

  return (
    <header className="flex items-center justify-between h-[60px] px-2.5 border-b border-borderColor">
      <div className="flex items-center gap-5">
        <Link href="/">
          <div className="flex items-center gap-2">
            <img
              src="/logo/v.png"
              alt="Veeno Logo"
              className="h-[30px] w-[30px] max-w-[25px] max-h-[25px] sm:max-w-[30px] sm:max-h-[30px]"
            />
            <h3 className="text-white font-poppins text-base sm:text-xl ">
              VEENO
            </h3>
            <nav className="ml-5 h-full hidden sm:flex">
              <ul className="text-white text-medium text-sm flex items-center gap-5 h-full">
                <li>Trade</li>
                <li>Dashboard</li>
                <li>Portfolio</li>
              </ul>
            </nav>
          </div>{" "}
        </Link>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex relative w-fit h-fit">
          <button
            className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2.5 rounded sm:rounded-md mr-2.5 flex items-center
        "
          >
            Deposit
          </button>
          <button
            className="text-white bg-terciary border border-base_color text-bold font-poppins text-xs
            h-[30px] sm:h-[35px] px-2 rounded sm:rounded-md mr-2.5 flex items-center
        "
          >
            <img
              src="https://cdn.prod.website-files.com/64c26cc84790d118b80c38c9/6529c7409cc925522834f61b_monad-logo-mark-white-rgb.svg"
              alt="monad logo"
              className="h-[15px] w-[15px] sm:h-[20px] sm:w-[20px]"
            />
            <IoChevronDown className="ml-1.5" />
          </button>
          <ConnectWallet />
          {/* {!isDisconnected ? ( */}
          <Tooltip isOpen={isTooltipOpen}>
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
          </Tooltip>
          <button
            className="sm:hidden flex items-center justify-center"
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
    </header>
  );
};
