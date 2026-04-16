import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import confetti from "canvas-confetti";

interface UnlockItem {
  type: "achievement" | "badge";
  name: string;
  description: string;
}

interface UnlockCelebrationProps {
  isOpen: boolean;
  items: UnlockItem[];
  onClose: () => void;
  showConfetti?: boolean;
}

export const UnlockCelebration = ({
  isOpen,
  items,
  onClose,
  showConfetti = true,
}: UnlockCelebrationProps) => {
  const [hasPlayedConfetti, setHasPlayedConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && showConfetti && !hasPlayedConfetti && items.length > 0) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setHasPlayedConfetti(true);
    }
  }, [isOpen, showConfetti, hasPlayedConfetti, items.length]);

  return (
    <AnimatePresence>
      {isOpen && items.length > 0 && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-bg-primary rounded-lg p-8 max-w-md w-full mx-4"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
              >
                <div className="text-6xl">🎉</div>
              </motion.div>
              <h2 className="text-3xl font-bold text-text-primary mb-2">
                🎊 Congratulations! 🎊
              </h2>
              <p className="text-text-secondary">
                You've unlocked new rewards!
              </p>
            </div>

            {/* Unlocked Items */}
            <div className="space-y-4 mb-8">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-bg-secondary border-2 border-brand-primary rounded-lg p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl mt-1">
                      {item.type === "badge" ? "🏆" : "⭐"}
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-lg">
                        {item.name}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Close Button */}
            <motion.button
              onClick={onClose}
              className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Awesome! Let's Go
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};