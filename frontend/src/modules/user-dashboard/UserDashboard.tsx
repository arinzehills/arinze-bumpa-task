import { useAuthStore } from "@app/stores/useAuthStore";

export const UserDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-text-secondary">
          Track your achievements and earn rewards on every purchase
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Points Card */}
        <div className="bg-brand-primary text-white p-8 rounded-lg shadow-lg">
          <p className="text-white/80 text-sm font-medium mb-2">Total Points</p>
          <p className="text-5xl font-bold">{user?.total_points || 0}</p>
          <p className="text-white/60 text-sm mt-4">
            Keep shopping to earn more points
          </p>
        </div>

        {/* Current Badge Card */}
        <div className="bg-bg-secondary p-8 rounded-lg border border-border-color">
          <p className="text-text-muted text-sm font-medium mb-4">
            Current Badge
          </p>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">
                {user?.current_badge_name || "No badge yet"}
              </p>
              <p className="text-sm text-text-secondary">
                {user?.current_badge_name
                  ? "Keep earning to unlock the next badge"
                  : "Complete your first purchase to earn a badge"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-bg-secondary p-6 rounded-lg border border-border-color">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="text-center py-12">
          <p className="text-text-secondary">No recent activity yet</p>
          <p className="text-sm text-text-muted mt-2">
            Your purchases and achievements will appear here
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-bg-secondary p-6 rounded-lg border border-border-color">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Placeholder achievement cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-bg-elevated p-4 rounded-lg text-center border border-border-color/50"
            >
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-xs text-text-muted">Achievement {i}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
