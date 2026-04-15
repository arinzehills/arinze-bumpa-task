import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BounceAnimationProps {
  children: ReactNode;
  delay?: number;
}

const BounceAnimation = ({ children, delay = 0.5 }: BounceAnimationProps) => {
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500, // high stiffness for strong bounce
        damping: 20, // lower damping allows bounce before settling
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default BounceAnimation;
