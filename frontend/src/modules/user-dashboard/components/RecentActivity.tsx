import { useEffect, useState } from "react";
import { useGet } from "@app/hooks/useGet";
import { useAuthStore } from "@app/stores/useAuthStore";
import { Loader } from "@components/Loader";

interface Payment {
  id: string;
  product_id: string;
  product_name?: string;
  amount: number;
  created_at: string;
}

interface Achievement {
  id: string;
  name: string;
  created_at?: string;
  unlocked_at?: string;
}

interface ActivityItem {
  type: "purchase" | "achievement";
  title: string;
  description: string;
  date: string;
  icon: string;
}

export const RecentActivity = () => {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: paymentHistory } = useGet<{
    payments: Payment[];
    pagination: any;
  }>("/payments/history", { autoFetch: true });

  const { data: achievements } = useGet<{
    achievements: Achievement[];
  }>(`/users/${user?.id}/achievements`, { autoFetch: !!user });

  useEffect(() => {
    const combinedActivities: ActivityItem[] = [];

    // Add payment activities
    if (paymentHistory?.payments) {
      paymentHistory.payments.forEach((payment) => {
        combinedActivities.push({
          type: "purchase",
          title: payment.product_name || "Product Purchase",
          description: `Purchased for $${(payment.amount / 100).toFixed(2)}`,
          date: new Date(payment.created_at).toLocaleDateString(),
          icon: "🛍️",
        });
      });
    }

    // Add achievement activities
    if (achievements?.achievements) {
      achievements.achievements.forEach((achievement) => {
        combinedActivities.push({
          type: "achievement",
          title: achievement.name,
          description: "Achievement Unlocked",
          date: new Date(
            achievement.unlocked_at || achievement.created_at || ""
          ).toLocaleDateString(),
          icon: "🏆",
        });
      });
    }

    // Sort by date descending (most recent first)
    combinedActivities.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setActivities(combinedActivities);
    setIsLoading(false);
  }, [paymentHistory, achievements]);

  if (isLoading) {
    return (
      <div className="bg-bg-secondary p-6 rounded-lg border border-border-color">
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
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
    );
  }

  return (
    <div className="bg-bg-secondary p-6 rounded-lg border border-border-color">
      <h2 className="text-xl font-bold text-text-primary mb-4">
        Recent Activity
      </h2>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 pb-4 border-b border-border-color last:border-0"
          >
            <div className="text-2xl">{activity.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-text-primary">{activity.title}</p>
              <p className="text-sm text-text-secondary">
                {activity.description}
              </p>
            </div>
            <div className="text-xs text-text-muted text-right">
              {activity.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};