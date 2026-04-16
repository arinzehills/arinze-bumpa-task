import { usePost } from '@app/hooks/usePost'
import { useState } from 'react'


interface PaymentResponse {
  cashback_points: number
  payment: {
    id: number
    status: string
    transaction_id: string
  }
  unlocked_achievements?: Array<{ name: string; description: string }>
  unlocked_badges?: Array<{ name: string; description: string }>
}

interface UnlockedItem {
  name: string
  description: string
  type: 'achievement' | 'badge'
}

export const usePurchase = () => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [unlockedItems, setUnlockedItems] = useState<UnlockedItem[]>([])
  const { execute: executePayment, isLoading: isProcessing } = usePost<PaymentResponse>()

  const handleBuyNow = async (productId: number) => {
    const response = await executePayment(
      '/payments',
      { product_id: productId },
      { canToastSuccess: true, canToastError: true }
    )

    if (response) {
      // Collect unlocked items
      const items: UnlockedItem[] = [
        ...(response.unlocked_achievements?.map((a) => ({ ...a, type: 'achievement' as const })) || []),
        ...(response.unlocked_badges?.map((b) => ({ ...b, type: 'badge' as const })) || []),
      ]

      // Store in localStorage for dashboard celebration
      if (items.length > 0) {
        localStorage.setItem('newlyUnlocked', JSON.stringify(items))
        setUnlockedItems(items)
      }

      setShowConfirm(false)
      setShowCelebration(true)
    }
  }

  const resetCelebration = () => {
    setShowCelebration(false)
    setUnlockedItems([])
  }

  return {
    showConfirm,
    setShowConfirm,
    showCelebration,
    setShowCelebration,
    unlockedItems,
    isProcessing,
    handleBuyNow,
    resetCelebration,
  }
}