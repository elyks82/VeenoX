"use client";
import { useGeneralContext } from "@/context";
import { EnableTrading } from "@/layouts/enable-trading";
import { FuturesAssetProps } from "@/models";
import { getFormattedAmount } from "@/utils/misc";
import { useHoldingStream, useWalletConnector } from "@orderly.network/hooks";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { Favorites } from "./layouts/favorites";
import { MobileOpenTrade } from "./layouts/mobile-open-trade";
import { MobilePnL } from "./layouts/mobile-pnl";
import { MobileSectionSelector } from "./layouts/mobile-section-selector";
import { OpenTrade } from "./layouts/open-trade";
import { CreateOrder } from "./layouts/open-trade/hook";
import { Orderbook } from "./layouts/orderbook";
import { Position } from "./layouts/position";
import { TokenInfo } from "./layouts/token-info";

const TradingViewChart = dynamic(() => import("./layouts/chart"), {
  ssr: false,
});

type PerpProps = {
  asset: FuturesAssetProps;
};

export const Perp = ({ asset }: PerpProps) => {
  const wallet = useWalletConnector();
  const chartRef = useRef<HTMLDivElement>(null);
  const [colWidths, setColWidths] = useState([6, 2, 2]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [topHeight, setTopHeight] = useState(70);
  const { mobileActiveSection, setIsChartLoading } = useGeneralContext();
  const rowUpRef = useRef<HTMLDivElement>(null);
  const { usdc } = useHoldingStream();

  const handleMouseDown = (index: number, e: any) => {
    if (window.innerWidth < 1024) return;

    const startX = e.clientX;
    const startWidths = [...colWidths];
    const containerWidth = (
      containerRef?.current as any
    ).getBoundingClientRect().width;

    const onMouseMove = (e: any) => {
      const dx = e.clientX - startX;
      const deltaFraction = (dx / containerWidth) * 10;
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
      (chartRef?.current as any).style.pointerEvents = "auto";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    (chartRef?.current as any).style.pointerEvents = "none";
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleMouse = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (window.innerWidth < 1024) return;
    const startY = e.clientY;
    const containerHeight = (
      containerRef.current as HTMLDivElement
    ).getBoundingClientRect().height;
    const startTopHeight = (topHeight / 100) * containerHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newTopHeight = startTopHeight + deltaY;
      const newTopHeightPercent = (newTopHeight / containerHeight) * 100;
      let rowUpHeight = rowUpRef.current?.clientHeight || 0;

      if (rowUpHeight > 720) {
        setTopHeight(Math.max(Math.min(newTopHeightPercent, 90), 10));
      } else {
        const isMovingDown = deltaY > 0;
        if (isMovingDown)
          setTopHeight(Math.max(Math.min(newTopHeightPercent, 90), 10));
      }
    };

    const handleMouseUp = () => {
      (chartRef?.current as any).style.pointerEvents = "auto";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    (chartRef?.current as any).style.pointerEvents = "none";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    setTimeout(() => setIsChartLoading(false), 7000);
    const handleResize = () => {
      if (window.innerWidth <= 600) {
        setColWidths([1, 1, 1]);
      } else if (window.innerWidth < 1200) {
        setColWidths([2, 1, 1]);
      } else {
        setColWidths([6, 2, 2]);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="container overflow-scroll no-scrollbar w-full max-w-full"
    >
      <EnableTrading />
      <div
        ref={rowUpRef}
        className="relative w-full border-b border-borderColor topPane md:flex-grow "
        style={{
          height: `${window.innerWidth < 768 ? "auto" : topHeight}%`,
          zIndex: 1,
        }}
      >
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: colWidths.map((w) => `${w}fr`).join(" "),
          }}
        >
          <div
            className="border-r border-borderColor overflow-x-hidden no-scrollbar"
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
          <div className="border-r border-borderColor hidden md:block h-full overflow-hidden">
            <Orderbook asset={asset} />
          </div>
          <div className="hidden md:block h-full ">
            <OpenTrade holding={usdc?.holding} />
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
      <div className="resizerY hidden md:flex" onMouseDown={handleMouse} />
      <div
        className="grid w-full h-auto border-b border-borderColor bottomPane"
        style={{
          gridTemplateColumns:
            window.innerWidth >= 1024
              ? `${colWidths[0] + colWidths[1]}fr ${colWidths[2]}fr`
              : "1fr",
          height: `${window.innerWidth < 768 ? "auto" : `${100 - topHeight}%`}`,
          zIndex: 0,
        }}
      >
        <div className="border-r border-b border-borderColor overflow-x-hidden no-scrollbar">
          <Position asset={asset} />
        </div>
        <div className="p-4 border-b border-borderColor hidden md:block">
          <div className="pb-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-font-60 mb-[3px]">
                  Total value (USDC)
                </p>
                <p className="text-base text-white font-medium">
                  {getFormattedAmount(usdc?.holding)}
                </p>
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
        </div>
      </div>
      <CreateOrder asset={asset} />
      <MobileOpenTrade asset={asset} holding={usdc?.holding} />
    </div>
  );
};
