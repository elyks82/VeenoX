"use client";
import { Tooltip } from "@/components/tooltip";
import {
  useAccount as useOrderlyAccount,
  useWalletConnector,
} from "@orderly.network/hooks";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
// import { useAccount } from "wagmi";

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
  // const { address, isDisconnected, isConnected, isConnecting } = useAccount();
  // const { connect, connectors, pendingConnector } = useConnect({
  //   onError: () => {
  //     //   setStatus("error");
  //   },
  //   onSuccess() {
  //     //   console.log("connected");
  //   },
  // });

  const { createAccount, createOrderlyKey, account, state } =
    useOrderlyAccount();
  const wallet = useWalletConnector();
  console.log("GET ORDERLY KEY", account.keyStore.getOrderlyKey(), account);

  const handleConnect = async () => {
    try {
      const result = await wallet.connect();
      console.log("Wallet connection result:", result);

      console.log("Account information:", account);
      console.log("account", account);
      if (!account) {
        console.error("Account ID is undefined after wallet connection.");
        return;
      }

      if (state.status === AccountStatusEnum.NotConnected) {
        await createAccount();
      }

      await createOrderlyKey(true);
    } catch (error) {
      console.error("Error during connection process:", error);
    }
  };

  useEffect(() => {
    if (state.status === AccountStatusEnum.NotConnected) {
      handleConnect();
    }
  }, [state.status]);

  const handleDisconnect = () => {
    // disconnect();
  };

  // console.log("state", wallet, account);

  const handleCopy = () => {
    // navigator.clipboard.writeText(address || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <header className="flex items-center justify-between h-[60px] px-2.5 border-b border-borderColor">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <img
            src="/logo/v.png"
            alt="Veeno Logo"
            className="h-[30px] w-[30px] max-w-[30px] max-h-[30px]"
          />
          <h3 className="text-white text-bold font-poppins text-xl">VEENO</h3>
          <nav className="ml-5 h-full">
            <ul className="text-white text-medium text-sm flex items-center gap-5 h-full">
              <li>Trade</li>
              <li>Dashboard</li>
              <li>Portfolio</li>
            </ul>
          </nav>
        </div>
        {/* <nav>
          <ul className="flex items-center gap-5">
            <li className="text-white text-bold font-poppins text-sm">
              <a href="/">Home</a>
            </li>
          </ul>
        </nav> */}
      </div>
      <div className="flex items-center gap-5">
        <div className="flex relative w-fit h-fit">
          <button
            className="text-white bg-terciary border border-emerald-700 text-bold font-poppins text-xs
        h-[35px] px-2 rounded-md mr-2.5 flex items-center
        "
          >
            <img
              src="https://cdn.prod.website-files.com/64c26cc84790d118b80c38c9/6529c7409cc925522834f61b_monad-logo-mark-white-rgb.svg"
              alt="monad logo"
              className="h-[20px] w-[20px]"
            />
            <IoChevronDown className="ml-1.5" />
          </button>
          <button
            className="text-white bg-emerald-700 border border-borderColor-DARK text-bold font-poppins text-xs
        h-[35px] px-2 rounded-md 
        "
            onClick={handleConnect}
            // onClick={async () => {
            //   wallet.connect();

            // handleConnection();
            // if (isConnected) {
            //   createAccount();
            //   createOrderlyKey(30);
            // }
            // }}
          >
            {/* {isDisconnected || isConnecting ? ( */}
            Connect wallet
            {/* ) : (
              <span className="inline-flex items-center">
                <p>{addressSlicer(address)}</p>
                <IoChevronDown className="ml-1" />
              </span>
            )} */}
          </button>

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
              onClick={handleDisconnect}
            >
              Disconnect
            </button>
          </Tooltip>
          {/* ) : null} */}
        </div>
      </div>
    </header>
  );
};
