import { useNavigate } from "react-router-dom";
import { Button } from "@components/Button";

export const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-primary/95 backdrop-blur-md border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold text-text-primary">
            Loyalty Rewards
          </div>
          <Button onClick={handleLogin} variant="primary" size="md">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary mb-6 leading-tight">
          Earn Rewards on Every Purchase
        </h1>
        <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          Shop from our partner stores and unlock exclusive achievements and
          badges. Every purchase brings you closer to amazing rewards.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleLogin}
            variant="primary"
            size="lg"
            className="min-w-[240px]"
          >
            Login to See Your Rewards
          </Button>
          <Button
            onClick={() => {
              document
                .getElementById("stores")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            variant="secondary"
            size="lg"
            className="min-w-[240px]"
          >
            Browse Stores
          </Button>
        </div>
      </section>

      {/* Partner Stores Section */}

      {/* Footer */}
      <footer className="bg-bg-primary border-t border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-muted text-sm">
          <p>&copy; 2024 Loyalty Rewards Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
