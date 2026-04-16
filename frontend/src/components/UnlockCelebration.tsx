import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import AnimatedModal from './AnimatedModal/AnimatedModal'
import { useCelebrationStore } from '@app/stores/useCelebrationStore'

export const UnlockCelebration = () => {
  const { isOpen, items, close } = useCelebrationStore()
  const [hasPlayedConfetti, setHasPlayedConfetti] = useState(false)

  useEffect(() => {
    if (isOpen && !hasPlayedConfetti) {
      // Trigger confetti on any successful payment
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
      setHasPlayedConfetti(true)
    }
  }, [isOpen, hasPlayedConfetti])

  // Reset confetti when modal closes
  useEffect(() => {
    if (!isOpen) {
      setHasPlayedConfetti(false)
    }
  }, [isOpen])

  return (
    <AnimatedModal
      openModal={isOpen}
      setOpenModal={(open) => {
        if (!open) {
          close()
        }
      }}
      maxWidthClass="max-w-2xl p-8"
      canClose={true}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-block mb-4"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
        >
          <div className="text-6xl">{items.length > 0 ? '🎉' : '✅'}</div>
        </motion.div>
        <h2 className="text-3xl font-bold text-text-primary mb-2">
          {items.length > 0 ? '🎊 Congratulations! 🎊' : '✨ Payment Successful! ✨'}
        </h2>
        <p className="text-text-secondary">
          {items.length > 0
            ? "You've unlocked new rewards!"
            : 'Your payment has been processed successfully. Keep buying to unlock achievements!'}
        </p>
      </div>

      {/* Unlocked Items */}
      {items.length > 0 && (
        <div className="space-y-4 mb-8 max-h-[50vh] overflow-y-auto">
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
                  {item.type === 'badge' ? '🏆' : '⭐'}
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
      )}

      {/* Close Button */}
      <motion.button
        onClick={close}
        className="w-full bg-brand-primary text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {items.length > 0 ? "Awesome! Let's Go" : 'Continue Shopping'}
      </motion.button>
    </AnimatedModal>
  )
}