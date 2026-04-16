import { useState, useEffect } from 'react'
import { useGet } from './useGet'

interface UnlockedItem {
  name: string
  description: string
  type: 'achievement' | 'badge'
}

interface VerifyPaymentResponse {
  success: boolean
  message: string
  unlocked_achievements: Array<{ name: string; description: string }>
  unlocked_badges: Array<{ name: string; description: string }>
}

export const usePaymentVerification = () => {
  const [reference, setReference] = useState<string | null>(null)

  // Detect reference in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const ref = urlParams.get('reference') || urlParams.get('trxref')

    if (ref) {
      setReference(ref)
    }
  }, [])

  // Fetch payment verification status when reference exists
  const { data: verifyResponse, isLoading, error } = useGet<VerifyPaymentResponse>(
    reference ? `/payments/verify?reference=${reference}` : '',
    { autoFetch: !!reference, cacheDuration: 0 } // No cache for payment verification
  )

  // Format unlocked items
  const unlockedItems: UnlockedItem[] = verifyResponse
    ? [
      ...(verifyResponse.unlocked_achievements?.map((a) => ({ ...a, type: 'achievement' as const })) || []),
      ...(verifyResponse.unlocked_badges?.map((b) => ({ ...b, type: 'badge' as const })) || []),
    ]
    : []

  // Clean up URL after verification completes
  useEffect(() => {
    if (!isLoading && reference) {
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [isLoading, reference])

  return {
    isVerifying: isLoading && reference !== null,
    reference,
    unlockedItems,
    hasPaymentReference: reference !== null,
    error,
  }
}