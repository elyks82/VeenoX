import Link from "next/link";

export const Row = ({ isEven = false }: { isEven?: boolean }) => {
  return (
    <div className="flex items-center mt-[80px] py-[80px] border-b border-borderColor-DARK">
      {isEven ? (
        <img
          src="https://pbs.twimg.com/profile_banners/1830299717814603778/1725373168/1500x500"
          className="object-cover w-[600px] h-[350px] border border-borderColor rounded-xl"
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
          src="https://pbs.twimg.com/profile_banners/1830299717814603778/1725373168/1500x500"
          className="object-cover w-[600px] h-[350px] border border-borderColor rounded-xl"
        />
      ) : null}
    </div>
  );
};
