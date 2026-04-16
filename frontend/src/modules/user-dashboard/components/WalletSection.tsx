import { useAuthStore } from "@app/stores/useAuthStore";
import { useGet } from "@app/hooks/useGet";
import { Loader } from "@components/Loader";
import type { PaginatedResponse } from "@app/api/types/paginationResponse";
import { useMemo } from "react";
import WalletBadgeItem from "./WalletBadgeItem";

interface Badge {
  id: number;
  name: string;
  description: string;
  points_threshold: number;
  icon?: string;
}

const WalletSection = () => {
  const { user } = useAuthStore();
  const { data: badgesResponse, isLoading } = useGet<PaginatedResponse<Badge>>(
    "/badges?limit=100",
    { autoFetch: true },
  );

  const badges = badgesResponse?.items || [];
  const userPoints = user?.total_points || 0;

  // Memoize badge calculations to avoid multiple sorts
  const { sortedBadges, currentBadge, nextBadge, pointsNeededForNext } = useMemo(() => {
    const sorted = [...badges].sort(
      (a, b) => a.points_threshold - b.points_threshold
    );

    const current = [...sorted]
      .sort((a, b) => b.points_threshold - a.points_threshold)
      .find((badge) => userPoints >= badge.points_threshold);

    const next = sorted.find((badge) => badge.points_threshold > userPoints);
    const pointsNeeded = next ? next.points_threshold - userPoints : 0;

    return { sortedBadges: sorted, currentBadge: current, nextBadge: next, pointsNeededForNext: pointsNeeded };
  }, [badges, userPoints]);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary border border-border-color rounded-lg p-6 flex items-center justify-center min-h-40">
        <Loader />
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 border border-brand-primary/20 rounded-lg p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        {nextBadge ? (
          <>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Get {nextBadge.name} to unlock exclusive rewards! 🎯
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-brand-primary">
                {userPoints}
              </span>
              <span className="text-text-secondary">/</span>
              <span className="text-lg text-text-secondary">
                {nextBadge.points_threshold} points
              </span>
            </div>
            <p className="text-sm text-text-secondary mt-1">
              {pointsNeededForNext} points to go!
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              🏆 You've unlocked all badges!
            </h3>
            <p className="text-sm text-text-secondary">
              Keep earning and maintaining your rewards
            </p>
          </>
        )}
      </div>

      {/* Badge Progress */}
      {badges.length > 0 && (
        <div>
          <p className="text-xs text-text-muted mb-3 uppercase tracking-wide">
            Badge Progression
          </p>
          <div className="grid grid-cols-3 gap-2">
            {sortedBadges.slice(0, 3).map((badge) => (
              <WalletBadgeItem
                key={badge.id}
                badge={badge}
                isUnlocked={userPoints >= badge.points_threshold}
                isCurrent={currentBadge?.id === badge.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {nextBadge && (
        <div className="mt-4">
          <div className="w-full bg-bg-elevated rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-primary to-brand-secondary h-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (userPoints / nextBadge.points_threshold) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSection;
