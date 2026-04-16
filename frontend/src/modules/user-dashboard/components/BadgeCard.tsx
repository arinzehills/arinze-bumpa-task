import { memo } from "react";
import { Icon } from "@iconify/react";

interface Badge {
  id: number;
  name: string;
  description: string;
  points_threshold: number;
  icon?: string;
}

interface BadgeCardProps {
  badge: Badge;
  isUnlocked: boolean;
  isCurrent: boolean;
}

const badgeColors: Record<string, { bg: string; icon: string }> = {
  Bronze: { bg: "from-orange-400 to-orange-600", icon: "ph:medal-fill" },
  Silver: { bg: "from-slate-300 to-slate-500", icon: "ph:medal-fill" },
  Gold: { bg: "from-yellow-300 to-yellow-600", icon: "ph:medal-fill" },
  Platinum: { bg: "from-cyan-300 to-cyan-600", icon: "ph:medal-fill" },
  Diamond: { bg: "from-purple-300 to-purple-600", icon: "ph:medal-fill" },
};

const BadgeCard = memo(({ badge, isUnlocked, isCurrent }: BadgeCardProps) => {
  const colors = badgeColors[badge.name] || {
    bg: "from-gray-400 to-gray-600",
    icon: "ph:medal-fill",
  };

  return (
    <div
      className={`rounded-lg p-6 border-2 transition-all ${
        isCurrent
          ? "border-brand-primary bg-brand-primary/5 shadow-lg scale-105"
          : isUnlocked
            ? "border-border-color bg-bg-elevated"
            : "border-border-color/30 bg-bg-primary opacity-60"
      }`}
    >
      {/* Badge Icon */}
      <div
        className={`w-20 h-20 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center mx-auto mb-4 shadow-lg`}
      >
        <Icon icon={colors.icon} className="text-4xl text-white" />
      </div>

      {/* Badge Info */}
      <h3 className="text-lg font-bold text-text-primary text-center mb-1">
        {badge.name}
      </h3>
      <p className="text-sm text-text-secondary text-center mb-4">
        {badge.description}
      </p>

      {/* Points Requirement */}
      <div className="bg-bg-secondary rounded-lg p-3 text-center mb-3">
        <p className="text-xs text-text-muted uppercase tracking-wide">
          Required Points
        </p>
        <p className="text-xl font-bold text-text-primary">
          {badge.points_threshold}
        </p>
      </div>

      {/* Status */}
      <div className="text-center">
        {isCurrent && (
          <span className="inline-block bg-brand-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Current
          </span>
        )}
        {isUnlocked && !isCurrent && (
          <span className="inline-block bg-brand-primary/30 text-brand-primary text-xs font-semibold px-3 py-1 rounded-full">
            ✓ Unlocked
          </span>
        )}
        {!isUnlocked && (
          <span className="inline-block bg-text-muted/10 text-text-muted text-xs font-semibold px-3 py-1 rounded-full">
            Locked
          </span>
        )}
      </div>
    </div>
  );
});

BadgeCard.displayName = "BadgeCard";

export default BadgeCard;