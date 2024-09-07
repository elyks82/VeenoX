"use client";
import { useScrollDirection } from "@/hook/useScrollDirection";
import Link from "next/link";

export const LandingHeader = () => {
  const scrollDirection = useScrollDirection();
  return (
    <div
      className={`fixed top-9 max-w-[1000px] left-1/2 -translate-x-1/2 h-[80px] z-[100] w-full
   bg-[#2b2f3649] border border-borderColor-DARK rounded-full
   backdrop-blur-md px-5 flex items-center justify-between transition-all duration-300
   ${scrollDirection === "down" ? "-translate-y-[120px]" : "translate-y-0"}`}
    >
      <img
        src="/veenox/veenox-text.png"
        alt="Veeno Logo"
        className="h-[35px] w-auto max-w-auto max-h-[25px] sm:max-w-auto sm:max-h-[35px]"
      />
      <nav className="h-full hidden lg:flex cursor-pointer">
        <ul className="text-white text-medium text-base flex items-center gap-5 h-full">
          <li>
            <Link
              href="/perp/PERP_BTC_USDC"
              className="w-full h-full hover:text-base_color"
            >
              Perps
            </Link>
          </li>
          <li>
            {" "}
            <Link
              href="https://x.com/veenox_xyz"
              className="w-full h-full hover:text-base_color"
            >
              Twitter
            </Link>
          </li>
          <li>
            {" "}
            <Link
              href="https://t.me/@veenox_xyz"
              className="w-full h-full hover:text-base_color"
            >
              Telegram
            </Link>
          </li>
          <li>
            {" "}
            <Link
              href="https://discord.com/invite/vwjQ24yZ"
              className="w-full h-full hover:text-base_color"
            >
              Discord
            </Link>
          </li>
        </ul>
      </nav>
      <button className="h-[45px] px-3 rounded-full text-white text-lg cursor-pointer bg-base_color">
        <Link
          href="/perp/PERP_BTC_USDC"
          className="w-full h-full hover:text-white"
        >
          <div className="flex items-center justify-center w-full text-base h-full px-4 py-2">
            Launch Alpha
          </div>
        </Link>
      </button>
    </div>
  );
};
