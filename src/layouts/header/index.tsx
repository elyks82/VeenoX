"use client";
import { Tooltip } from "@/components/tooltip";
import { addressSlicer } from "@/utils/misc";
import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoChevronDown } from "react-icons/io5";
import { MdContentCopy } from "react-icons/md";
import { useAccount, useConnect } from "wagmi";
import { disconnect } from "wagmi/actions";

export const Header = () => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { address, isDisconnected, isConnecting } = useAccount();
  const { connect, connectors, pendingConnector } = useConnect({
    onError: () => {
      //   setStatus("error");
    },
    onSuccess() {
      //   console.log("connected");
    },
  });

  const handleConnection = () => {
    if (isDisconnected) connect({ connector: connectors[0] });
    else setIsTooltipOpen((prev) => !prev);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(address || "");
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <header className="flex items-center justify-between h-[80px] px-5 border-b border-borderColor">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <img
            src="/v.png"
            alt="Veeno Logo"
            className="h-[40px] w-[40px] max-w-[40px] max-h-[40px]"
          />
          <h3 className="text-white text-bold font-poppins text-lg">VEENO</h3>
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
            className="text-white bg-terciary border border-borderColor-DARK text-bold font-poppins text-sm
        h-[40px] px-3 rounded-md 
        "
            onClick={handleConnection}
          >
            {isDisconnected || isConnecting ? (
              "Connect Wallet"
            ) : (
              <span className="inline-flex items-center">
                <p>{addressSlicer(address)}</p>
                <IoChevronDown className="ml-1" />
              </span>
            )}
          </button>
          {!isDisconnected ? (
            <Tooltip isOpen={isTooltipOpen}>
              <div className="flex items-center  text-sm" onClick={handleCopy}>
                <p>{addressSlicer(address)}</p>
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
          ) : null}
        </div>
      </div>
    </header>
  );
};
