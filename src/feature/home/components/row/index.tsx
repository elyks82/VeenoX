import Link from "next/link";

export const Row = ({ isEven = false }: { isEven?: boolean }) => {
  return (
    <div className="flex items-center justify-between w-full mt-[0px] py-[80px] border-b border-borderColor-DARK">
      {isEven ? (
        <img
          src="/veenox/trading-platform.png"
          className="object-cover w-[570px] h-[300px] shadow-2xl shadow-[rgba(0,0,0,0.2)] border border-borderColor rounded-xl"
        />
      ) : null}

      <div className={isEven ? "ml-[50px]" : "mr-[50px]"}>
        <h4 className="text-white font-bold text-3xl mb-2">
          Seamless & intuitive trading
        </h4>
        <ul className="text-font-60 text-lg">
          <li>Trade across spot, margin and futures in one place</li>
          <li>Customizable interface with drag-and-drop widgets</li>
        </ul>
        <button className="text-base_color font-medium text-lg mt-[50px]">
          <Link href="/perp/PERP_BTC_USDC">Get started</Link>
        </button>
      </div>
      {!isEven ? (
        <img
          src="/veenox/trading-platform.png"
          className="object-cover w-[570px] h-[300px] shadow-2xl shadow-[rgba(0,0,0,0.2)] border border-borderColor rounded-xl"
        />
      ) : null}
    </div>
  );
};
