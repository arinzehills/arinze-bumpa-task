import { useEffect, useState } from "react";
import WelcomeSetion from "./components/WelcomeSetion";
import { HowItWorks } from "./components/HowItWorks";
import WalletSection from "./components/WalletSection";
import BadgesShowcase from "./components/BadgesShowcase";
import { RecentActivity } from "./components/RecentActivity";
import { UnlockCelebration } from "@components/UnlockCelebration";
import confetti from "canvas-confetti";
import { useRefreshUserInfo } from "@app/hooks/useRefreshUserInfo";

export const UserDashboard = () => {
  useRefreshUserInfo();
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedItems, setUnlockedItems] = useState<any[]>([]);

  // Check for newly unlocked items on mount
  useEffect(() => {
    const newlyUnlocked = localStorage.getItem("newlyUnlocked");
    if (newlyUnlocked) {
      try {
        const items = JSON.parse(newlyUnlocked);
        if (items.length > 0) {
          setUnlockedItems(items);
          setShowCelebration(true);
          // Clear from localStorage
          localStorage.removeItem("newlyUnlocked");
          // Trigger confetti
          setTimeout(() => {
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.5 },
            });
          }, 500);
        }
      } catch (e) {
        console.error("Failed to parse unlocked items", e);
      }
    }
  }, []);

  return (
    <>
      <UnlockCelebration
        isOpen={showCelebration}
        items={unlockedItems}
        onClose={() => setShowCelebration(false)}
        showConfetti={false}
      />
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeSetion />

        {/* How It Works & Wallet Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-2 h-full">
            <HowItWorks />
          </div>
          <div className="lg:col-span-3 h-full">
            <WalletSection />
          </div>
        </div>

        {/* Badges Showcase Section */}
        <BadgesShowcase />

        {/* Recent Activity Section */}
        <RecentActivity />
      </div>
    </>
  );
};

export default UserDashboard;
