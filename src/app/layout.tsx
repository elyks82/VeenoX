import { Footer } from "@/layouts/footer";
import { Header } from "@/layouts/header";
import { config } from "@/lib/wallet-connect/config";
import WagmiProvider from "@/lib/wallet-connect/provider";
import { Providers } from "@/provider/wrapper";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import "react-toastify/dist/ReactToastify.css";
import { cookieToInitialState } from "wagmi";
import "./globals.css";

// const OrderlyContainer = dynamic(() => import("./common/OrderlyProvider"), {
//   ssr: false,
// });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VeenoX ",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiProvider initialState={initialState}>
          <Providers>
            <Header />
            {children}
            <SpeedInsights />
            <Footer />
          </Providers>
        </WagmiProvider>
      </body>
    </html>
  );
}
