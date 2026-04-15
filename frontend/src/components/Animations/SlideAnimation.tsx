/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const SlideAnimation = ({ children }: any) => {
  const [slideIn, setSlideIn] = useState(true);
  const handleSlide = () => setSlideIn(!slideIn);
  useEffect(() => {
    handleSlide();
  }, []);
  return (
    <AnimatePresence>
      {!slideIn && (
        <motion.div
          initial={{
            x: 100,
            opacity: 0,
          }}
          animate={{
            x: 0,
            opacity: 1,
            transition: {
              delay: 0.3,
              duration: 0.7,
            },
          }}
          exit={{ opacity: 0, x: 100 }}
        >
          {children ?? "Children"}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideAnimation;
