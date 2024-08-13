import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <h1 className="text-base_color text-4xl">
        <Link href="/perp/PERP_BTC_USDC">
          Click here to access the trading platform (Build in progress)
        </Link>
      </h1>
    </div>
  );
}
