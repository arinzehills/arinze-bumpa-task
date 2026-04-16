import { useAuthStore } from "@app/stores/useAuthStore";
import { useGet } from "@app/hooks/useGet";
import { Icon } from "@iconify/react";
import { Loader } from "@components/Loader";
import type { PaginatedResponse } from "@app/api/types/paginationResponse";

interface Badge {
  id: number;
  name: string;
  description: string;
  points_threshold: number;
  icon?: string;
}

const badgeColors: Record<string, { bg: string; icon: string }> = {
  Bronze: { bg: "from-orange-400 to-orange-600", icon: "ph:medal-fill" },
  Silver: { bg: "from-slate-300 to-slate-500", icon: "ph:medal-fill" },
  Gold: { bg: "from-yellow-300 to-yellow-600", icon: "ph:medal-fill" },
  Platinum: { bg: "from-cyan-300 to-cyan-600", icon: "ph:medal-fill" },
  Diamond: { bg: "from-purple-300 to-purple-600", icon: "ph:medal-fill" },
};

const BadgesShowcase = () => {
  const { user } = useAuthStore();
  const { data: badgesResponse, isLoading } = useGet<PaginatedResponse<Badge>>(
    "/badges?limit=100",
    { autoFetch: true },
  );

  const badges = badgesResponse?.items || [];
  const userPoints = user?.total_points || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">
          Badge Tiers
        </h2>
        <p className="text-text-secondary">
          Earn more points to unlock exclusive badge tiers and rewards
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {badges
          .sort((a, b) => a.points_threshold - b.points_threshold)
          .map((badge) => {
            const isUnlocked = userPoints >= badge.points_threshold;
            const isCurrent =
              userPoints >= badge.points_threshold &&
              badges
                .filter((b) => userPoints >= b.points_threshold)
                .sort((a, b) => b.points_threshold - a.points_threshold)[0]
                ?.id === badge.id;

            const colors = badgeColors[badge.name] || {
              bg: "from-gray-400 to-gray-600",
              icon: "ph:medal-fill",
            };

            return (
              <div
                key={badge.id}
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
          })}
      </div>
    </div>
  );
};

export default BadgesShowcase;