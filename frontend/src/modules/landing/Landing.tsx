import { useNavigate } from "react-router-dom";
import { Button } from "@components/Button";
import { StoreCard } from "@components/StoreCard";

const PARTNER_STORES = [
  {
    id: "1",
    name: "Bumpa",
    description: "Shop quality products and earn rewards",
    icon: "mdi:store",
    backgroundColor: "bg-bg-secondary",
    iconColor: "text-text-primary",
  },
  {
    id: "2",
    name: "Jumia",
    description: "Discover amazing deals and earn badges",
    icon: "hugeicons:jumpers",
    backgroundColor: "bg-text-primary",
    iconColor: "text-white",
  },
  {
    id: "3",
    name: "Konga",
    description: "Great products at competitive prices",
    icon: "mdi:cart",
    backgroundColor: "bg-bg-secondary",
    iconColor: "text-text-primary",
  },
  {
    id: "4",
    name: "Aliexpress",
    description: "Affordable products from around the world",
    icon: "mdi:package-variant",
    backgroundColor: "bg-text-primary",
    iconColor: "text-white",
  },
];

export const Landing = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleStoreClick = (storeId: string) => {
    navigate(`/ecommerce/store/${storeId}`);
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
      <section
        id="stores"
        className="bg-bg-secondary py-20 sm:py-32 border-t border-border-color"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Shop from Our Partners
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Click on any store below to start shopping and earning rewards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_STORES.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.name}
                description={store.description}
                icon={store.icon}
                backgroundColor={store.backgroundColor}
                iconColor={store.iconColor}
                onClick={() => handleStoreClick(store.id)}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-text-muted text-base">
              More partner stores coming soon. Check back regularly for new
              opportunities to earn rewards!
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-primary border-t border-border-color py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-text-muted text-sm">
          <p>&copy; 2024 Loyalty Rewards Program. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
