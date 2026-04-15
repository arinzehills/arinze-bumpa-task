import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FadeAnimationProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
}

const FadeAnimation = ({
  children,
  direction = "up",
  delay = 0.1,
  duration = 0.5
}: FadeAnimationProps) => {
  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { y: 30, x: 0 };
      case "down": return { y: -30, x: 0 };
      case "left": return { y: 0, x: 30 };
      case "right": return { y: 0, x: -30 };
      default: return { y: 30, x: 0 };
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...getInitialPosition()
      }}
      animate={{
        opacity: 1,
        y: 0,
        x: 0
      }}
      transition={{
        delay,
        duration,
        ease: "easeOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default FadeAnimation;
