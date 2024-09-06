import { cn } from "@/utils/cn";
import { MotionValue, motion } from "framer-motion";
import Tilt from "react-parallax-tilt";

type CardProps = {
  translate: MotionValue;
  position: string;
  delay: number;
  description: string;
  title: string;
  image: string;
  isOdd?: boolean;
  className?: string;
  scrollYProgress: any;
};

export const Card = ({
  translate,
  position,
  delay,
  description,
  title,
  image,
  isOdd = false,
  className = "",
  scrollYProgress,
}: CardProps) => {
  const options = {
    glareEnable: true,
    glareMaxOpacity: 0.3,
    glareColor: "rgba(255,255,255,0.2)",
    glarePosition: "all",
    glareBorderRadius: 10,
    perspective: 100000,
    scale: 1.05,
    gyroscope: true,
    transitionSpeed: 2000,
    flipHorizontally: false,
    tiltMaxAngleX: 12,
    tiltMaxAngleY: 12,
  };

  return (
    <motion.div
      style={{ [position]: translate, opacity: scrollYProgress }}
      transition={{ delay }}
    >
      <Tilt
        className={cn(
          `bg-terciary backdrop-blur-sm object-cover bg-no-repeat  bg-line bg-cover bg-end p-4 h-[350px] rounded-lg border border-borderColor shadow-lg shadow-[rgba(0,0,0,0.2)]`,
          className
        )}
        {...(options as any)}
      >
        <div className="flex w-full h-full justify-center items-center flex-col p-5">
          <img src={image} className="rounded-full" height={80} width={80} />
          <p className="text-white font-bold text-center text-xl mt-10">
            {title}
          </p>
          <p className="text-font-60 text-sm text-center w-full mt-2">
            {description}
          </p>
        </div>
      </Tilt>
    </motion.div>
  );
};
