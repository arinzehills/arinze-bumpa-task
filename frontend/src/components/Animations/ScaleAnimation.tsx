import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScaleAnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
}

const ScaleAnimation = ({
  children,
  delay = 0.2,
  duration = 0.6
}: ScaleAnimationProps) => {
  return (
    <motion.div
      initial={{
        scale: 0.8,
        opacity: 0,
        y: 20
      }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0
      }}
      transition={{
        delay,
        duration,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth feel
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScaleAnimation;
