"use client";
import { useGeneralContext } from "@/context";
import { FuturesAssetProps } from "@/models";
import { useWalletConnector } from "@orderly.network/hooks";
import { useRef, useState } from "react";
import TradingViewChart from "./layouts/chart";
import { Favorites } from "./layouts/favorites";
import { MobileOpenTrade } from "./layouts/mobile-open-trade";
import { MobilePnL } from "./layouts/mobile-pnl";
import { MobileSectionSelector } from "./layouts/mobile-section-selector";
import { OpenTrade } from "./layouts/open-trade";
import { Orderbook } from "./layouts/orderbook";
import { Position } from "./layouts/position";
import { TokenInfo } from "./layouts/token-info";

type PerpProps = {
  asset: FuturesAssetProps;
};

export const Perp = ({ asset }: PerpProps) => {
  const wallet = useWalletConnector();
  const chartRef = useRef<HTMLDivElement>(null);
  const [colWidths, setColWidths] = useState([6, 2, 2]);
  const containerRef = useRef(null);

  const handleMouseDown = (index: number, e: any) => {
    if (window.innerWidth < 1024) return;

    const startX = e.clientX;
    const startWidths = [...colWidths];
    if (!containerRef?.current) return;
    const containerWidth = (
      containerRef?.current as any
    ).getBoundingClientRect().width;

    const onMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - startX;
      const deltaFraction = (dx / containerWidth) * 10;
      if (chartRef.current) {
        chartRef.current.style.pointerEvents = "none";
      }

      const newWidths = [...startWidths];

      if (index === 0) {
        newWidths[0] = Math.max(startWidths[0] + deltaFraction, 1);
        newWidths[1] = Math.max(startWidths[1] - deltaFraction, 1);
      } else if (index === 1) {
        newWidths[1] = Math.max(startWidths[1] + deltaFraction, 1);
        newWidths[2] = Math.max(startWidths[2] - deltaFraction, 1);
      }
      setColWidths(newWidths);
    };

    const onMouseUp = () => {
      if (chartRef.current) {
        chartRef.current.style.pointerEvents = "auto";
      }

      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const { setMobileActiveSection, mobileActiveSection } = useGeneralContext();
  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full border-b border-borderColor"
      >
        <div
          className="grid w-full"
          style={{
            gridTemplateColumns: colWidths.map((w) => `${w}fr`).join(" "),
          }}
        >
          <div
            className="border-r border-borderColor overflow-x-hidden "
            ref={chartRef}
          >
            {!mobileActiveSection ? (
              <>
                <Favorites />
                <TokenInfo asset={asset} />
                <MobilePnL />
                <MobileSectionSelector />
                <TradingViewChart asset={asset} className={""} />
              </>
            ) : (
              <>
                <TokenInfo asset={asset} />
                <MobilePnL />
                <MobileSectionSelector />
                <div
                  className={`${
                    mobileActiveSection === "Chart" || !mobileActiveSection
                      ? "block"
                      : "hidden"
                  } bg-green`}
                >
                  <TradingViewChart asset={asset} className={""} />
                </div>
                <div
                  className={`${
                    mobileActiveSection !== "Chart" ? "block" : "hidden"
                  }`}
                >
                  <Orderbook asset={asset} isMobile />
                </div>
              </>
            )}
          </div>

          {/* Column 2 */}
          <div className="border-r border-borderColor hidden sm:block ">
            <Orderbook asset={asset} />
          </div>

          {/* Column 3 */}
          <div className="hidden sm:block">
            <OpenTrade />
          </div>
        </div>
        {window.innerWidth >= 1024 &&
          colWidths.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className="absolute top-0 bottom-0 w-[10px] cursor-col-resize z-10"
              style={{
                left: `calc(${
                  (colWidths.slice(0, index + 1).reduce((a, b) => a + b, 0) /
                    colWidths.reduce((a, b) => a + b, 0)) *
                  100
                }% - 5px)`,
              }}
              onMouseDown={(e) => handleMouseDown(index, e)}
            />
          ))}
      </div>
      <div
        className="grid w-full h-auto border-b border-borderColor"
        style={{
          gridTemplateColumns:
            window.innerWidth >= 1024
              ? `${colWidths[0] + colWidths[1]}fr ${colWidths[2]}fr`
              : "1fr",
        }}
      >
        <div className="border-r border-b border-borderColor overflow-x-hidden">
          <Position asset={asset} />
        </div>

        <div className="p-4 border-b border-borderColor hidden sm:block">
          <div className="border-b border-borderColor pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-font-60 mb-[3px]">
                  Total value (USDC)
                </p>
                <p className="text-base text-white font-medium">0.00</p>
              </div>
              <div>
                <p className="text-xs text-font-60 mb-1">Unreal PnL (USDC)</p>
                <p className="text-sm text-white font-medium text-end">
                  0.00 (0.00%)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5">
              <div>
                <p className="text-xs text-font-60 mb-1">
                  Unsettled PnL (USDC)
                </p>
                <p className="text-sm text-white font-medium">0.00</p>
              </div>
              <button className="flex items-center bg-terciary border border-borderColor-DARK rounded px-2 py-1 text-xs text-white">
                <span>Settle PnL</span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full text-sm text-white h-[40px] flex items-center justify-center border border-borderColor-DARK bg-terciary rounded">
              Deposit
            </button>
            <button className="w-full text-sm text-white h-[40px] flex items-center justify-center border border-borderColor-DARK bg-terciary rounded">
              Withdraw
            </button>
          </div>
        </div>
      </div>
      <MobileOpenTrade asset={asset} />
    </>
  );
};
