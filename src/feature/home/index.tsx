"use client";
import { BackgroundBeamsWithCollision } from "@/components/background-home";
import {
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
// @ts-ignore

type BoxProps = {
  children: React.ReactNode;
  className?: string;
  isOdd?: boolean;
};

const Box: React.FC<BoxProps> = ({ children, className, isOdd = false }) => (
  <div
    className={`bg-terciary p-4 h-[350px] rounded-[40px] border border-borderColor shadow-lg shadow-[rgba(0,0,0,0.2)] ${className}`}
    style={{
      backgroundImage: isOdd
        ? "linear-gradient(45deg, rgba(43,47,54,1) 27%, #1B1D22 100%)"
        : "linear-gradient(135deg, #1B1D22 27%, rgba(43,47,54,1) 100%)",
    }}
  >
    {children}
  </div>
);

export const Home = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  const mainControls = useAnimation();
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView]);

  const springConfig = { stiffness: 100, damping: 10, bounce: 0 };
  const cardRef = useRef(null);

  const { scrollYProgress: scrollYFirst } = useScroll({
    target: cardRef,
    offset: ["0 1", "0.5 1"],
  });
  const { scrollYProgress: scrollYSec } = useScroll({
    target: cardRef,
    offset: ["0.1 1", "0.6 1"],
  });
  const { scrollYProgress: scrollYThird } = useScroll({
    target: cardRef,
    offset: ["0.25 1", "0.75 1"],
  });

  const translateYFirst = useTransform(scrollYFirst, [0, 1], [150, 0]);
  const translateYSec = useTransform(scrollYSec, [0, 1], [150, 0]);
  const translateYThird = useTransform(scrollYThird, [0, 1], [150, 0]);

  const translateXFirst = useTransform(scrollYFirst, [0, 1], [150, 0]);
  const translateXSec = useTransform(scrollYSec, [0, 1], [150, 0]);
  const translateXThird = useTransform(scrollYThird, [0, 1], [150, 0]);

  const getAnimationStyle = (i: number) => {
    if (i === 0)
      return {
        position: "translateY",
        translate: translateYFirst,
        delay: 0,
        scrollYProgress: scrollYFirst,
      };
    else if (i === 1)
      return {
        position: "translateY",
        translate: translateYSec,
        delay: 0.5,
        scrollYProgress: scrollYSec,
      };
    else if (i === 2)
      return {
        position: "translateY",
        translate: translateYThird,
        delay: 1,
        scrollYProgress: scrollYThird,
      };
    else if (i === 3)
      return {
        position: "translateY",
        translate: translateXFirst,
        delay: 1.5,
        scrollYProgress: scrollYFirst,
      };
    else if (i === 4)
      return {
        position: "translateY",
        translate: translateYSec,
        delay: 2,
        scrollYProgress: scrollYSec,
      };
    return {
      position: "translateY",
      translate: translateXThird,
      delay: 2.5,
      scrollYProgress: scrollYThird,
    };
  };

  return (
    <div className="flex flex-col bg-secondary" ref={ref}>
      <BackgroundBeamsWithCollision>
        {/* <div className="w-full flex items-center justify-center">
          <motion.div className="flex flex-col w-fit">
            <motion.div
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
              initial="visible"
              animate={mainControls}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="overflow-hidden block relative whitespace-nowrap
                text-7xl font-bold w-auto text-white uppercase text-center"
            >
              Unleash limitless trading
              <br /> with lowest fees
            </motion.div>
            <motion.div
              className="flex items-center w-full"
              initial="visible"
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
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <p className="text-lg text-font-80 font-normal text-center mx-auto mt-7 max-w-[600px]">
                Experience a new era of trading with Veeno, the pioneering
                decentralized exchange on Monad. Enjoy an intuitive user
                interface and benefit from the{" "}
                <span className="text-white font-bold">lowest fees</span> in the
                market, powered by Orderly Network for seamless and
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
                delay: 0.9,
              }}
              className="mt-[50px] rounded mx-auto text-white text-lg mr-auto cursor-pointer bg-base_color"
            >
              <Link href="/perp/PERP_BTC_USDC" className="w-full h-full">
                <div className="flex items-center justify-center w-full text-lg h-full px-4 py-2">
                  Access preview{" "}
                </div>
              </Link>
            </motion.button>
          </motion.div>
        </div> */}
        <p
          className="overflow-hidden block relative whitespace-nowrap
                text-7xl font-bold w-auto text-white uppercase text-center"
        >
          build in progress
        </p>
      </BackgroundBeamsWithCollision>
      {/* <div className="w-full relative border-t border-borderColor">
        <div className="w-[90%] max-w-[1200px] mx-auto relative flex flex-col items-center justify-center my-[10%]">
          <h2
            className="overflow-hidden block relative whitespace-nowrap
           text-6xl font-bold text-center mb-2 w-auto  text-white"
          >
            Powerful trading tools
          </h2>
          <Row isEven />
          <Row />
          <Row isEven />
        </div>
      </div>
      <div
        className="w-[90%] max-w-[1200px] mx-auto flex flex-col items-center justify-center mt-[5%] mb-[15%]"
        ref={cardRef}
      >
        <motion.h2
          style={{ opacity: scrollYFirst }}
          className="overflow-hidden block relative whitespace-nowrap
              text-6xl font-bold mb-2 w-auto mr-auto  text-white"
        >
          Level up trading experience
        </motion.h2>
        <div className="flex w-full justify-between flex-wrap mt-[50px]">
          {gridContent.map((content, i) => {
            const { translate, position, delay, scrollYProgress } =
              getAnimationStyle(i);
            return (
              <div
                key={i}
                className={`${
                  i === gridContent?.length - 1 ? "w-full" : "w-[49%]"
                } min-h-[170px] py-8 px-10 rounded-xl mb-[20px] border border-borderColor`}
              >
                <img
                  src={content.image}
                  className="w-[50px] h-[50px] rounded-full"
                  alt={content.title + "image"}
                />
                <p className="text-xl mt-5 text-white font-bold">
                  {content.title}
                </p>
                <p className="text-base mt-2 text-font-60">
                  {content.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <HeroParallax />

      <div className="w-full h-fit flex flex-col items-center bg-[#1e2126]">
        <div className="w-[90%] max-w-[1350px]">
          <div className="py-[10vh] flex items-center gap-20 justify-between w-full ">
            <div className="bg-secondary flex items-center justify-center p-5 w-[600px] h-[500px] rounded-xl">
              <Image
                src="/layer/trade.webp"
                alt={"learn to trade image"}
                height={600}
                width={500}
              />{" "}
            </div>
            <div className="flex flex-col items-start">
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
  text-6xl font-bold  mb-2 w-auto  text-white text-start"
              >
                <span className="text-base_color">Learn</span> Trading
              </motion.h2>
              <h2
                className="block relative whitespace-nowrap
      text-6xl font-bold text-white mb-2 w-auto text-start"
              >
                & Earn Program
              </h2>
              <p className="text-lg text-font-60 mt-5 max-w-[600px] text-start">
                The Learn Trading and Earn program addresses the lack of trading
                knowledge by teaching individuals how to trade effectively and
                avoid irreversible losses. The program includes instructional
                videos created by a professional trader that explain each
                pattern in detail. Participants can practice trading and earn
                rewards for their efforts.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[90%] max-w-[1350px] mx-auto">
        <div className="py-[20vh] flex items-center justify-between w-full ">
          <div className="flex w-fit ">
            <div className="flex flex-col items-start">
              <h2
                className="overflow-hidden block relative whitespace-nowrap
  text-6xl font-bold  mb-2 w-auto  text-white text-start"
              >
                <span className="text-base_color text-start">Lowest fees</span>{" "}
                <br />
                across the market
              </h2>

              <p className="text-lg text-font-60 mt-5 max-w-[600px]">
                Our platform offers the lowest trading fees among all perpetual
                decentralized exchanges (DEXs) in the crypto space. By
                prioritizing cost efficiency, we empower traders to maximize
                their profits while enjoying a seamless and secure trading
                experience. With our industry-leading low fees, users can trade
                with confidence, knowing they’re getting the best value
                available.
              </p>
            </div>
          </div>
          <img
            src="https://s3.eu-central-1.amazonaws.com/tangem.cms/k_61_419d178016.png"
            alt={"learn to trade image"}
            height={400}
            width={500}
          />
        </div>
      </div>
      <div className="w-full h-fit flex flex-col items-center bg-[#1e2126]">
        <div className="w-[90%] max-w-[1350px]">
          <div className="py-[10vh] flex items-center gap-20 justify-between w-full ">
            <div className="bg-secondary flex items-center justify-center p-5 w-[600px] h-[500px] rounded-xl">
              <img
                src="https://www.ballet.com/static/banner_swap-1bb72278fb0ce04e8b09119769c9c491.png"
                alt={"learn to trade image"}
                height={400}
                width={500}
              />
            </div>
            <div className="flex w-fit mb-10 mr-[5%]">
              <div className="flex flex-col items-start">
                <h2
                  className="overflow-hidden block relative whitespace-nowrap
  text-6xl font-bold  mb-2 w-auto  text-white"
                >
                  Swap on <span className=" text-base_color">Monad</span>
                </h2>

                <p className="text-lg text-font-60 mt-5 max-w-[600px]">
                  Users will have the capability to seamlessly swap any assets
                  available on the Monad chain. This functionality ensures
                  flexibility and convenience, enabling users to exchange a wide
                  variety of digital assets within the ecosystem, enhancing
                  their overall experience and providing greater control over
                  their transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};
