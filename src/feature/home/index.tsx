"use client";
import { Deposit } from "@/layouts/deposit";
import { motion, useAnimation, useInView } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const Home = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  return (
    <div
      className="flex flex-col w-screen-header"
      style={{
        backgroundImage:
          "radial-gradient(circle at right 350%, #443a7e, #0a0a0a)",
      }}
      ref={ref}
    >
      <Deposit />
      <section className="h-calc-full-header flex items-center w-screen-header ml-[10%]">
        <motion.img
          initial="initial"
          variants={{
            initial: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
            },
          }}
          animate={mainControls}
          transition={{ duration: 0.3, delay: 0.1 }}
          src="/logo/veeno-purple.png"
          className="h-[640px] z-[0] w-auto absolute translate-y-1/2 left-1/2 top-1/2 opacity-100 animate-float-y"
        />
        <div className="h-full w-[90%] mx-auto flex items-center z-10">
          <div className="w-full flex items-center">
            <motion.div className="flex flex-col w-fit">
              <motion.h1
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="overflow-hidden block relative whitespace-nowrap
  text-7xl font-bold  mb-2 w-auto text-outlined "
              >
                Veeno
              </motion.h1>
              <motion.h2
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration: 0.3, delay: 0.6 }}
                className="overflow-hidden block relative whitespace-nowrap
      text-7xl font-bold dark:text-white text-black mb-2 w-auto"
              >
                Unlock the
                <span className="ml-3 ">future of</span>
              </motion.h2>
              <motion.div
                className="flex items-center"
                initial="initial"
                whileHover="hovered"
                variants={{
                  initial: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                animate={mainControls}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <h2
                  className="text-7xl font-bold mb-2 flex items-center"
                  style={{
                    verticalAlign: "middle",
                    margin: 0,
                    padding: 0,
                    marginRight: "20px",
                  }}
                >
                  <p className=" dark:text-white">Trading with </p>
                  <span className="text-white ml-3">minimal fees</span>
                </h2>
              </motion.div>
              <motion.div
                className="flex items-center"
                initial="initial"
                whileHover="hovered"
                variants={{
                  initial: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                animate={mainControls}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                <p className="text-xl text-font-60 font-normal mt-8 max-w-[800px]">
                  Experience a new era of trading with Veeno, the pioneering
                  decentralized exchange on Monad. Enjoy an intuitive user
                  interface and benefit from the{" "}
                  <span className="text-white font-medium">lowest fees</span> in
                  the market, powered by Orderly Network for seamless and
                  cost-effective trading.
                </p>
              </motion.div>
              <motion.button
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 10,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                animate={mainControls}
                transition={{
                  duration: 0.3,
                  delay: 1.5,
                }}
                className="mt-[50px] rounded px-5 py-3 text-white text-lg mr-auto cursor-pointer bg-base_color"
              >
                <Link href="/perp/PERP_BTC_USDC" className="w-full h-full">
                  Access preview
                </Link>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
