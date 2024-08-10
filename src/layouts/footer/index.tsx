"use client";
import { useWS } from "@orderly.network/hooks";
import { useEffect } from "react";
import { FaWifi } from "react-icons/fa6";

export const Footer = () => {
  const ws = useWS();

  useEffect(() => {
    console.log("Im the useEffect");
    const unsubscribe = ws.subscribe(
      {
        id: "maintenance_status",
        topic: "maintenance_status",
        event: "subscribe",
      },
      {
        onMessage: (data: any) => {
          console.log("datadata", data);
        },
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [ws]);
  return (
    <footer className="h-[40px] flex items-center justify-between fixed bottom-0 w-full bg-secondary border-t border-borderColor">
      <div className="flex items-center px-2.5">
        <FaWifi className="text-green text-sm font-bold" />
        <p className="text-green text-sm ml-2 font-bold">Operational</p>
        <div className="h-[30px] w-[1px] bg-borderColor mx-5" />
        <p className="text-font-60 text-xs">Join our community</p>
      </div>
      <div className="flex items-center px-2.5">
        <p className="text-font-60 text-xs">Powered by</p>
        <img
          className="ml-2"
          src="/logo/orderly-powered.svg"
          alt="Orderly network logo"
        />
      </div>
    </footer>
  );
};
