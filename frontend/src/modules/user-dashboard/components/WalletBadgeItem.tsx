import { memo } from "react";
import { Icon } from "@iconify/react";

interface Badge {
  id: number;
  name: string;
  points_threshold: number;
}

interface WalletBadgeItemProps {
  badge: Badge;
  isUnlocked: boolean;
  isCurrent: boolean;
}

const WalletBadgeItem = memo(({ badge, isUnlocked, isCurrent }: WalletBadgeItemProps) => {
  return (
    <div className="text-center">
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 transition-all ${
          isCurrent
            ? "bg-brand-primary text-white shadow-lg scale-110"
            : isUnlocked
              ? "bg-brand-primary/30 text-brand-primary"
              : "bg-bg-elevated text-text-muted"
        }`}
      >
        <Icon icon="ph:medal-fill" className="text-2xl" />
      </div>
      <p className="text-xs font-semibold text-text-primary">{badge.name}</p>
      <p className="text-xs text-text-muted">{badge.points_threshold} pts</p>
    </div>
  );
});

WalletBadgeItem.displayName = "WalletBadgeItem";

export default WalletBadgeItem;