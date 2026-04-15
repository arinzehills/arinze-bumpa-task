import { useNavigate } from "react-router-dom";
import { PARTNER_STORES } from "../data/partnerStoreList";
import { StoreCard } from "@components/StoreCard";

const PartnersStoreList = () => {
  const navigate = useNavigate();

  const handleStoreClick = (storeId: string) => {
    navigate(`/ecommerce/store/${storeId}`);
  };
  return (
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
  );
};

export default PartnersStoreList;
