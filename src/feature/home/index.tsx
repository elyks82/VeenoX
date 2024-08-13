"use client";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";

export const Home = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const text1 = "";
  const text2 = "";
  const textSplit = text1.split("");
  const text2split = text2.split("");
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });
  const { scrollYProgress } = useScroll({
    offset: ["1 1", "1 1"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateY = useTransform(scrollYProgress, [0, 1], ["-100vh", "100vh"]);

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
      {/* <Loader3D /> */}
      {/* <SplineScene /> */}
      <section
        className="h-calc-full-header flex items-center w-screen-header ml-[10%]"
        // style={{
        //   backgroundImage: "url('/logo/darkv.png')",
        //   backgroundPosition: "100% 50%",
        //   backgroundRepeat: "no-repeat",
        // }}
      >
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
          className="h-[640px] z-[0] w-auto absolute translate-y-1/2 left-1/2 top-1/2 opacity-100"
          style={{
            transform: "rotateZ(15deg) translateX(-20%) translateY(-40%)",
          }}
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

                {/* <motion.div
                  className="overflow-hidden block relative whitespace-nowrap
text-7xl font-bold dark:text-white text-black mb-5 pt-1 h-[78px] w-full"
                  style={{
                    lineHeight: "78px",
                    verticalAlign: "middle",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <div>
                    {textSplit?.map((l, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          initial: {
                            y: 0,
                          },
                          hovered: {
                            y: "-100%",
                          },
                        }}
                        transition={{
                          duration: 0.25,
                          ease: "easeInOut",
                          delay: i * 0.025,
                        }}
                        className="inline-block"
                      >
                        {l}
                      </motion.span>
                    ))}
                  </div>
                  <div className="absolute inset-0">
                    {text2split?.map((l, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          initial: {
                            y: "100%",
                          },
                          hovered: {
                            y: 0,
                          },
                        }}
                        transition={{
                          duration: 0.25,
                          ease: "easeInOut",
                          delay: i * 0.025,
                        }}
                        className="inline-block pt-1"
                      >
                        {l}
                      </motion.span>
                    ))}
                  </div>
                </motion.div> */}
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
            {/* <img src="/logo/v3D.png" className="ml-[10%]" /> */}
          </div>
        </div>
      </section>

      {/* <div className="h-screen bg-red-200 w-screen-header ml-[240px]"></div> */}
    </div>
  );
};
