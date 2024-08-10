import { FuturesAssetProps } from "@/models";
import { useEffect, useRef, useState } from "react";
import { thead } from "./constants";

type PositionProps = {
  asset: FuturesAssetProps;
};

enum Sections {
  POSITION,
  PENDING,
  TP_SL,
  FILLED,
  ORDER_HISTORY,
}

export const Position = ({ asset }: PositionProps) => {
  const [activeSection, setActiveSection] = useState(Sections.POSITION);
  const sections = ["Positions", "Pending", "TP/SL", "Filled", "Order History"];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underlineStyle, setUnderlineStyle] = useState<{
    width: string;
    left: string;
  }>({ width: "20%", left: "0%" });

  useEffect(() => {
    const updateUnderline = () => {
      const button = buttonRefs.current[activeSection];
      if (button) {
        const { offsetWidth, offsetLeft } = button;
        setUnderlineStyle({
          width: `${offsetWidth}px`,
          left: `${offsetLeft}px`,
        });
      }
    };

    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [activeSection]);

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-borderColor ">
        <div className="flex items-center relative">
          {sections.map((section, index) => (
            <button
              key={index}
              ref={(el) => (buttonRefs.current[index] = el)}
              className={`text-sm text-white font-bold p-2.5 ${
                activeSection === index ? "font-bikd" : ""
              }`}
              onClick={() => setActiveSection(index)}
            >
              {section}
            </button>
          ))}
          <div
            className="h-0.5 w-[20%] absolute bottom-0 bg-white transition-all duration-200 ease-in-out"
            style={{ width: underlineStyle.width, left: underlineStyle.left }}
          />
        </div>
      </div>
      <div className="p-2.5 flex items-center gap-5">
        <div>
          <p className="text-xs text-font-60 mb-[3px]">Unreal. PnL</p>
          <p className="text-base text-white font-medium">0 (0.00%)</p>
        </div>
        <div>
          <p className="text-xs text-font-60 mb-[3px]">Notional</p>
          <p className="text-base text-white font-medium">0.00</p>
        </div>
      </div>
      <div className="overflow-x-scroll min-h-[300px] w-full">
        <table className="w-full">
          <thead>
            <tr>
              {thead[activeSection].map((title: string, i: number) => {
                const odd = i % 2 === 0;
                const isFirst = i === 0;
                const isLast = i === thead[activeSection].length - 1;
                return (
                  <th
                    key={i}
                    className={`text-xs ${
                      isFirst ? "text-start pl-5" : "text-end "
                    } ${
                      isLast ? "pr-5" : ""
                    } px-2.5 py-2.5 text-font-80 whitespace-nowrap font-normal border-y border-borderColor`}
                  >
                    {title}
                  </th>
                );
              })}
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};
