import { useAuthStore } from "@app/stores/useAuthStore";
import { useGet } from "@app/hooks/useGet";
import { Icon } from "@iconify/react";
import { Loader } from "@components/Loader";
import type { PaginatedResponse } from "@app/api/types/paginationResponse";

interface Achievement {
  id: number;
  name: string;
  description: string;
  criteria: {
    type: string;
    value: number;
  };
  points: number;
}

interface UserAchievement {
  id: number;
  name: string;
  description: string;
  created_at?: string;
}

const AchievementsPage = () => {
  const { user } = useAuthStore();

  // Fetch all achievements
  const { data: allAchievementsResponse, isLoading: isLoadingAll } =
    useGet<PaginatedResponse<Achievement>>(
      "/achievements?limit=100",
      { autoFetch: true }
    );

  // Fetch user's achievements
  const { data: userAchievementsResponse, isLoading: isLoadingUser } =
    useGet<any>(
      `/users/${user?.id}/achievements`,
      { autoFetch: true }
    );

  const allAchievements = allAchievementsResponse?.items || [];
  const userAchievements = userAchievementsResponse?.achievements || [];
  const unlockedIds = new Set(userAchievements.map((a: any) => a.id));

  const achievementIcons: Record<string, string> = {
    first_purchase: "ph:gift",
    purchase_count: "ph:shopping-cart",
    total_spent: "ph:money",
  };

  if (isLoadingAll || isLoadingUser) {
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
          Achievements
        </h2>
        <p className="text-text-secondary">
          Unlock achievements by completing purchase milestones and goals
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-lg p-4">
          <p className="text-sm text-text-muted mb-1">Unlocked</p>
          <p className="text-3xl font-bold text-brand-primary">
            {unlockedIds.size}
          </p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4">
          <p className="text-sm text-text-muted mb-1">Total Achievements</p>
          <p className="text-3xl font-bold text-text-primary">
            {allAchievements.length}
          </p>
        </div>
        <div className="bg-bg-secondary border border-border-color rounded-lg p-4">
          <p className="text-sm text-text-muted mb-1">Progress</p>
          <p className="text-3xl font-bold text-text-primary">
            {allAchievements.length > 0
              ? Math.round((unlockedIds.size / allAchievements.length) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allAchievements.map((achievement) => {
          const isUnlocked = unlockedIds.has(achievement.id);
          const iconName =
            achievementIcons[achievement.criteria.type] || "ph:star";

          return (
            <div
              key={achievement.id}
              className={`rounded-lg border-2 p-6 transition-all ${
                isUnlocked
                  ? "bg-brand-primary/5 border-brand-primary"
                  : "bg-bg-secondary border-border-color opacity-60"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isUnlocked
                    ? "bg-brand-primary text-white"
                    : "bg-bg-elevated text-text-muted"
                }`}
              >
                <Icon icon={iconName} className="text-3xl" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-text-primary text-center mb-2">
                {achievement.name}
              </h3>
              <p className="text-sm text-text-secondary text-center mb-4">
                {achievement.description}
              </p>

              {/* Criteria */}
              <div className="bg-bg-elevated rounded-lg p-3 mb-4 text-center">
                <p className="text-xs text-text-muted uppercase tracking-wide">
                  {achievement.criteria.type.replace(/_/g, " ")}
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {achievement.criteria.value}
                </p>
              </div>

              {/* Points */}
              <div className="text-center mb-4">
                <p className="text-sm text-text-muted">Reward</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {achievement.points} pts
                </p>
              </div>

              {/* Status Badge */}
              <div className="text-center">
                {isUnlocked ? (
                  <span className="inline-block bg-brand-primary text-white text-xs font-semibold px-4 py-2 rounded-full">
                    ✓ Unlocked
                  </span>
                ) : (
                  <span className="inline-block bg-text-muted/10 text-text-muted text-xs font-semibold px-4 py-2 rounded-full">
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {allAchievements.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary mb-2">No achievements available</p>
          <p className="text-sm text-text-muted">
            Come back later to see available achievements
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;