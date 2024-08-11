import { useState } from "react";

export const MobileSectionSelector = () => {
  const sections = ["Chart", "Orderbook", "Market"];
  const [activeSection, setActiveSection] = useState("Chart");

  const getBarPosition = () => {
    switch (activeSection) {
      case "Chart":
        return "left-0";
      case "Orderbook":
        return "left-1/3";
      case "Market":
        return "left-2/3";
      default:
        return "left-0";
    }
  };
  const barPosition = getBarPosition();

  return (
    <div className="border-b border-borderColor h-[45px] w-full block sm:hidden relative">
      <div className="flex items-center justify-between h-[44px] w-[100%]">
        {sections.map((section, i) => (
          <button
            key={i}
            className="w-1/3 h-full text-white text-sm"
            onClick={() => setActiveSection(section)}
          >
            {section}
          </button>
        ))}
      </div>
      <div className="bg-borderColor h-[1px] w-full relative">
        <div
          className={`h-[1px] w-1/3 bottom-0 transition-all duration-200 ease-in-out bg-font-80 absolute ${barPosition}`}
        />
      </div>
    </div>
  );
};
