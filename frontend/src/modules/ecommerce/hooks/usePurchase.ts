import { usePost } from '@app/hooks/usePost'
import { useAuthStore } from '@app/stores/useAuthStore'
import { useRedirectStore } from '@app/stores/useRedirectStore'
import { useNavigate } from 'react-router-dom'
import { SideToast } from '@components/Toast'
import { useState, useEffect } from 'react'

interface InitializePaymentResponse {
  payment_url: string,
  data: {
    payment_url: string
    reference: string
  }
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
  const { execute: executeInitialize, isLoading: isProcessing } = usePost<InitializePaymentResponse>()
  const { isAuthenticated } = useAuthStore()
  const { setRedirectUrl } = useRedirectStore()
  const navigate = useNavigate()

  // Check for payment verification on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const paymentSuccess = urlParams.get('payment_success')
    const reference = urlParams.get('reference')

    if (paymentSuccess === 'true' && reference) {
      // Show success message
      SideToast.FireSuccess({
        title: 'Payment Successful',
        message: 'Your purchase was completed successfully!'
      })

      // Refresh dashboard data
      localStorage.setItem('paymentCompleted', 'true')

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    } else if (paymentSuccess === 'false') {
      SideToast.FireError({
        title: 'Payment Failed',
        message: 'Your payment could not be processed. Please try again.'
      })

      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleBuyNow = async (productId: number) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setRedirectUrl(window.location.pathname)
      SideToast.FireWarning({
        title: 'Login Required',
        message: 'Please login to make a purchase'
      })
      navigate('/login')
      return
    }

    // Initialize payment with Paystack
    const redirectUrl = window.location.origin + window.location.pathname
    const response = await executeInitialize(
      '/payments/initialize',
      { product_id: productId, redirect_url: redirectUrl },
      { canToastSuccess: false, canToastError: true }
    )

    if (response) {
      // Handle both possible response structures
      const paymentUrl = response.payment_url || response.data?.payment_url
      if (paymentUrl) {
        // Redirect to Paystack payment page
        window.location.href = paymentUrl
      }
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