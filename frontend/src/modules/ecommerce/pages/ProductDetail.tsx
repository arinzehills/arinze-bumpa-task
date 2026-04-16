import { useParams } from "react-router-dom";
import { useGet } from "@app/hooks/useGet";
import { Loader } from "@components/Loader";
import { UnlockCelebration } from "@components/UnlockCelebration";
import ConfirmModal from "@components/AnimatedModal/ConfirmModal";
import { usePurchase } from "../hooks/usePurchase";
import { Product } from "../components/ProductItem";
import { useState, useEffect } from "react";
import FadeAnimation from "@components/Animations/FadeAnimation";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductGallery from "./components/ProductGallery";
import ProductInfoPanel from "./components/ProductInfoPanel";
import ProductErrorState from "./components/ProductErrorState";

interface UnlockedItem {
  name: string
  description: string
  type: 'achievement' | 'badge'
}

interface PaymentStatusResponse {
  status: string
  unlocked_achievements: Array<{ name: string; description: string }>
  unlocked_badges: Array<{ name: string; description: string }>
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [showPaymentCelebration, setShowPaymentCelebration] = useState(false);
  const [paymentUnlockedItems, setPaymentUnlockedItems] = useState<UnlockedItem[]>([]);
  const [reference, setReference] = useState<string | null>(null);

  const {
    showConfirm,
    setShowConfirm,
    isProcessing,
    handleBuyNow,
  } = usePurchase();

  // Fetch payment status from backend using useGet hook
  const { data: paymentStatus } = useGet<PaymentStatusResponse>(
    `/payments/status?reference=${reference || ''}`,
    { autoFetch: !!reference }
  );

  // Check for payment verification in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment_success');
    const ref = urlParams.get('reference');

    if (paymentSuccess === 'true' && ref) {
      setReference(ref);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // When payment status arrives, show celebration
  useEffect(() => {
    if (paymentStatus && reference) {
      const items: UnlockedItem[] = [
        ...(paymentStatus.unlocked_achievements?.map((a) => ({ ...a, type: 'achievement' as const })) || []),
        ...(paymentStatus.unlocked_badges?.map((b) => ({ ...b, type: 'badge' as const })) || []),
      ];
      if (items.length > 0) {
        setPaymentUnlockedItems(items);
        setShowPaymentCelebration(true);
      }
    }
  }, [paymentStatus, reference]);

  // Fetch product details
  const {
    data: product,
    isLoading: isLoadingProduct,
    error,
  } = useGet<Product>(`/products/${productId}`, { autoFetch: true });

  const handlePurchase = async () => {
    if (!product) return;
    await handleBuyNow(product.id);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !product) {
    return <ProductErrorState />;
  }

  const handlePaymentCelebrationClose = () => {
    setShowPaymentCelebration(false);
  };

  return (
    <>
      <UnlockCelebration
        isOpen={showPaymentCelebration}
        items={paymentUnlockedItems}
        onClose={handlePaymentCelebrationClose}
        showConfetti={true}
      />

      <ConfirmModal
        openModal={showConfirm}
        setOpenModal={setShowConfirm}
        onConfirm={handlePurchase}
        loading={isProcessing}
        type="warning"
        title="Confirm Purchase"
        message={`Are you sure you want to purchase ${product?.name}?`}
        confirmText="Yes, Buy Now"
        cancelText="Cancel"
      />

      <div className="min-h-screen bg-gray-50">
        <ProductDetailHeader />

        <main className="max-w-6xl mx-auto px-4 py-8">
          <FadeAnimation direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProductGallery product={product} />
              <ProductInfoPanel
                product={product}
                isProcessing={isProcessing}
                onBuyClick={() => setShowConfirm(true)}
              />
            </div>
          </FadeAnimation>
        </main>
      </div>
    </>
  );
};

export default ProductDetail;
