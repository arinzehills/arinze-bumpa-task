import { useAuthStore } from "@app/stores/useAuthStore";

const WelcomeSetion = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-text-secondary">
          Track your achievements and earn rewards on every purchase
        </p>
      </div>
      <img src="/img/loyalty.png" alt="Logo" />
    </div>
  );
};

export default WelcomeSetion;
