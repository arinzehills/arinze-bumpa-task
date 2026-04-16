import { useAuthStore } from "@app/stores/useAuthStore";
import { useGet } from "@app/hooks/useGet";
import { Loader } from "@components/Loader";
import type { PaginatedResponse } from "@app/api/types/paginationResponse";
import { useMemo } from "react";
import BadgeCard from "./BadgeCard";

interface Badge {
  id: number;
  name: string;
  description: string;
  points_threshold: number;
  icon?: string;
}

const BadgesShowcase = () => {
  const { user } = useAuthStore();
  const { data: badgesResponse, isLoading } = useGet<PaginatedResponse<Badge>>(
    "/badges?limit=100",
    { autoFetch: true },
  );

  const badges = badgesResponse?.items || [];
  const userPoints = user?.total_points || 0;

  // Memoize sorted badges and current badge to avoid O(n²) complexity
  const { sortedBadges, currentBadge } = useMemo(() => {
    const sorted = [...badges].sort(
      (a, b) => a.points_threshold - b.points_threshold,
    );
    const unlockedBadges = sorted.filter(
      (b) => userPoints >= b.points_threshold,
    );
    const current = unlockedBadges.length
      ? unlockedBadges[unlockedBadges.length - 1]
      : null;
    return { sortedBadges: sorted, currentBadge: current };
  }, [badges, userPoints]);

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
        {sortedBadges.map((badge) => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isUnlocked={userPoints >= badge.points_threshold}
            isCurrent={currentBadge?.id === badge.id}
          />
        ))}
      </div>
    </div>
  );
};

export default BadgesShowcase;