import { useNavigate } from "react-router-dom";
import { Button } from "@components/Button";
import { useAuthStore } from "@app/stores/useAuthStore";
import { Icon } from "@iconify/react/dist/iconify.js";

export const NavBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex  gap-2 text-sm sm:text-xl font-semibold text-text-primary">
          Bumpa <span className="hidden sm:block"> Loyalty Rewards</span>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Button
                onClick={handleDashboard}
                variant="black"
                size="md"
                rightIcon={<Icon icon="ep:top-right" width={18} height={18} />}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                variant="secondary"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleLogin} variant="primary" size="md">
                Login
              </Button>
              <Button onClick={handleRegister} variant="secondary" size="md">
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
