import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { Toast } from "@components/Toast";
import { Loader } from "@components/Loader";
import { UnlockCelebration } from "@components/UnlockCelebration";
import { Landing } from "@modules/landing/Landing";
import { EcommerceStore } from "@modules/ecommerce/EcommerceStore";
import ProductDetail from "@modules/ecommerce/pages/ProductDetail";
import { AuthLayout } from "@app/layouts/AuthLayout";
import { Login } from "@modules/auth/Login";
import { Register } from "@modules/auth/Register";
import { AdminLogin } from "@modules/auth/AdminLogin";
import { AdminRoutes } from "@app/routing/AdminRoutes";
import { UserRoutes } from "@app/routing/UserRoutes";
import Unauthorized from "@components/Unauthorized";
import { usePaymentVerification } from "@app/hooks/usePaymentVerification";

function AppContent() {
  const { isVerifying, unlockedItems, hasPaymentReference } =
    usePaymentVerification();
  const [showCelebration, setShowCelebration] = useState(false);

  // Show celebration when verification completes and there are unlocked items
  useEffect(() => {
    if (hasPaymentReference && !isVerifying && unlockedItems.length > 0) {
      setShowCelebration(true);
    }
  }, [hasPaymentReference, isVerifying, unlockedItems]);

  const handleCelebrationClose = () => {
    setShowCelebration(false);
  };

  return (
    <>
      {/* Payment verification modal */}
      {isVerifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <Loader />
            <p className="text-center mt-4 text-gray-600">
              Verifying your payment...
            </p>
          </div>
        </div>
      )}

      {/* Show unlocked items after verification */}
      <UnlockCelebration
        isOpen={showCelebration}
        items={unlockedItems}
        onClose={handleCelebrationClose}
        showConfetti={true}
      />

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Ecommerce Routes */}
        <Route path="/ecommerce/store/:storeId" element={<EcommerceStore />} />
        <Route
          path="/ecommerce/products/:productId"
          element={<ProductDetail />}
        />

        {/* Auth Routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="admin-login" element={<AdminLogin />} />
        </Route>

        {/* User Dashboard Routes */}
        <>{UserRoutes()}</>

        {/* Admin Routes */}
        <>{AdminRoutes()}</>

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Toast />
      <AppContent />
    </Router>
  );
}

export default App;
