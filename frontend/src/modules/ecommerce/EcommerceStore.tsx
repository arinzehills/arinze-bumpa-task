import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@components/Button";
import { AuthButtons } from "@components/AuthButtons";
import { useGet } from "@app/hooks/useGet";
import FadeAnimation from "@components/Animations/FadeAnimation";
import { Loader } from "@components/Loader";
import ProductItem, { Product } from "./components/ProductItem";
import { motion } from "framer-motion";
import type { PaginatedResponse } from "@app/api/types/paginationResponse";

const STORE_DETAILS: Record<string, { name: string; description: string }> = {
  "1": { name: "Bumpa", description: "Quality products for everyday needs" },
  "2": { name: "Jumia", description: "Everything you need in one place" },
  "3": { name: "Konga", description: "Best deals and authentic products" },
};

export const EcommerceStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const store = storeId ? STORE_DETAILS[storeId] : null;
  const [hideRedirect, setHideRedirect] = useState(false);

  // Fetch products using useGet hook
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useGet<PaginatedResponse<Product>>("/products", {
    autoFetch: true,
    cacheDuration: 5 * 60 * 1000,
  });

  const products = productsResponse?.items || [];

  // Auto-hide redirect message after 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setHideRedirect(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            Store not found
          </h1>
          <Button onClick={() => navigate("/")} variant="primary">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <header className="bg-bg-secondary border-b border-border-color p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="text-brand-secondary hover:underline font-medium text-sm sm:text-base whitespace-nowrap"
          >
            ← Back to home
          </button>
          <h1 className="text-lg sm:text-2xl font-bold text-text-primary truncate">{store.name}</h1>
          <AuthButtons primarySize="sm" gap="gap-2 sm:gap-3" hideLogoutText={true} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Animated Redirect Message - slides off screen */}
        {!hideRedirect && (
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ delay: 1, duration: 0.7 }}
            className="bg-bg-elevated border border-border-color rounded-lg p-8 mb-8 text-center"
          >
            <p className="text-text-muted mb-2">
              🛍️ Loading {store.name} ecommerce store...
            </p>
            <Loader />
            <p className="text-sm text-text-secondary">
              When you make purchases here, your achievements will be tracked
              automatically.
            </p>
          </motion.div>
        )}

        {/* Products Section with Animations */}
        {hideRedirect && (
          <FadeAnimation direction="up" duration={0.8} delay={0}>
            <div>
              {/* Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">
                  {store.name} Products
                </h2>
                <p className="text-text-secondary">
                  Browse our collection and earn loyalty points with every
                  purchase!
                </p>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center py-16">
                  <Loader />
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                  <p className="text-red-800 mb-4">Failed to load products</p>
                  <Button onClick={() => navigate("/")} variant="secondary">
                    Back to Stores
                  </Button>
                </div>
              )}

              {/* Products Grid */}
              {!isLoading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <FadeAnimation
                      key={product.id}
                      direction="up"
                      delay={0.1 * (index + 1)}
                      duration={0.6}
                    >
                      <ProductItem product={product} />
                    </FadeAnimation>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && products.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-text-muted mb-4">No products available</p>
                  <Button onClick={() => navigate("/")} variant="secondary">
                    Back to Stores
                  </Button>
                </div>
              )}
            </div>
          </FadeAnimation>
        )}
      </main>
    </div>
  );
};
