import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SpringAnimationProps {
  children: ReactNode;
  delay?: number;
  stiffness?: number;
  damping?: number;
}

const SpringAnimation = ({
  children,
  delay = 0.3,
  stiffness = 100,
  damping = 15,
}: SpringAnimationProps) => {
  return (
    <motion.div
      initial={{
        scale: 0.5,
        opacity: 0,
        rotate: -10,
        y: 50,
      }}
      animate={{
        scale: 1,
        opacity: 1,
        rotate: 0,
        y: 0,
      }}
      transition={{
        delay,
        type: "spring",
        stiffness,
        damping,
        mass: 1,
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  );
};

export default SpringAnimation;
