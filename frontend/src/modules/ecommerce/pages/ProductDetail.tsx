import { useParams } from "react-router-dom";
import { useGet } from "@app/hooks/useGet";
import { Loader } from "@components/Loader";
import ConfirmModal from "@components/AnimatedModal/ConfirmModal";
import { usePurchase } from "../hooks/usePurchase";
import { Product } from "../components/ProductItem";
import FadeAnimation from "@components/Animations/FadeAnimation";
import ProductDetailHeader from "./components/ProductDetailHeader";
import ProductGallery from "./components/ProductGallery";
import ProductInfoPanel from "./components/ProductInfoPanel";
import ProductErrorState from "./components/ProductErrorState";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();

  const {
    showConfirm,
    setShowConfirm,
    isProcessing,
    handleBuyNow,
  } = usePurchase();

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

  return (
    <>
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
