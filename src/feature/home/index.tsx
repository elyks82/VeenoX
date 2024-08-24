"use client";
import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
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
      className="flex flex-col"
      style={{
        backgroundImage: "radial-gradient(circle at top, #1b1d22 , #0f0f0f)",
      }}
      ref={ref}
    >
      <section className="h-fit pt-[15%] pb-[10%] relative flex items-center w-screen-header pl-[10%]">
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
                className="mt-[50px] rounded  text-white text-lg mr-auto cursor-pointer bg-base_color"
              >
                <Link href="/perp/PERP_BTC_USDC" className="w-full h-full">
                  <div className="flex items-center justify-center w-full h-full px-5 py-3">
                    Access preview{" "}
                  </div>
                </Link>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>{" "}
      z
      <section className="py-[10vh] flex items-center justify-center w-full ">
        <div className="flex flex-col w-fit">
          <motion.h2
            // variants={{
            //   hidden: {
            //     opacity: 0,
            //     y: 10,
            //   },
            //   visible: {
            //     opacity: 1,
            //     y: 0,
            //   },
            // }}
            // initial="hidden"
            // animate={mainControls}
            // transition={{ duration: 0.3, delay: 0.3 }}
            className="overflow-hidden block relative whitespace-nowrap
  text-7xl font-bold  mb-2 w-auto  text-white text-start"
          >
            <span className="text-outlined text-black">Learn</span> Trading
          </motion.h2>
          <h2
            className="block relative whitespace-nowrap
      text-7xl font-bold text-white mb-2 w-auto text-start"
          >
            & Earn Program
          </h2>
          <p className="text-lg text-font-60 mt-5 max-w-[800px] text-start">
            Learn trading and earn program aim to teach people how to trade,
            helping them to avoid irreversible loss. This program contain videos
            made by a proffessional trader explaining each patern. Users will
            have to try itself get rewarded for it.
          </p>
        </div>
        <Image
          src="/layer/trade.webp"
          alt={"learn to trade image"}
          height={500}
          width={700}
        />
      </section>
      <section className="py-[10vh] flex items-center justify-center w-full ">
        <img
          src="https://s3.eu-central-1.amazonaws.com/tangem.cms/k_61_419d178016.png"
          alt={"learn to trade image"}
          height={400}
          width={600}
        />
        <div className="flex w-fit  ml-[5%]">
          <div className="">
            <h2
              className="overflow-hidden block relative whitespace-nowrap
  text-7xl font-bold  mb-2 w-auto  text-white text-end"
            >
              <span className="text-outlined text-black text-end">
                Lowest fees
              </span>{" "}
              <br />
              across the market
            </h2>

            <p className="text-lg text-font-60 mt-5 max-w-[800px] text-end">
              Our platform offers the lowest trading fees among all perpetual
              decentralized exchanges (DEXs) in the crypto space. By
              prioritizing cost efficiency, we empower traders to maximize their
              profits while enjoying a seamless and secure trading experience.
              With our industry-leading low fees, users can trade with
              confidence, knowing they’re getting the best value available.
            </p>
          </div>
        </div>
      </section>
      <section className="py-[10vh] flex items-center justify-center w-full ">
        <div className="flex w-fit mb-10  mr-[5%]">
          <div className="">
            <h2
              className="overflow-hidden block relative whitespace-nowrap
  text-7xl font-bold  mb-2 w-auto  text-white"
            >
              <span className="text-outlined text-black">Swap</span> on Monad
            </h2>

            <p className="text-lg text-font-60 mt-5 max-w-[800px]">
              Users will have the capability to seamlessly swap any assets
              available on the Monad chain. This functionality ensures
              flexibility and convenience, enabling users to exchange a wide
              variety of digital assets within the ecosystem, enhancing their
              overall experience and providing greater control over their
              transactions.
            </p>
          </div>
        </div>
        <img
          src="https://www.ballet.com/static/banner_swap-1bb72278fb0ce04e8b09119769c9c491.png"
          alt={"learn to trade image"}
          height={400}
          width={600}
        />
      </section>
    </div>
  );
};
