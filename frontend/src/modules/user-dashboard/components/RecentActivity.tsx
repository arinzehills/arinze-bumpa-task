import { useMemo } from "react";
import { useGet } from "@app/hooks/useGet";
import { useAuthStore } from "@app/stores/useAuthStore";
import { Loader } from "@components/Loader";
import ActivityItem from "./ActivityItem";

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

  const { data: paymentHistory } = useGet<{
    payments: Payment[];
    pagination: any;
  }>("/payments/history", { autoFetch: true });

  const { data: achievements } = useGet<{
    achievements: Achievement[];
  }>(`/users/${user?.id}/achievements`, { autoFetch: !!user });

  // Memoize combined and sorted activities to avoid recalculation
  const { activities, isLoading } = useMemo(() => {
    const combined: ActivityItem[] = [];

    // Add payment activities
    if (paymentHistory?.payments) {
      paymentHistory.payments.forEach((payment) => {
        combined.push({
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
        combined.push({
          type: "achievement",
          title: achievement.name,
          description: "Achievement Unlocked",
          date: new Date(
            achievement.unlocked_at || achievement.created_at || "",
          ).toLocaleDateString(),
          icon: "🏆",
        });
      });
    }

    // Sort by date descending (most recent first)
    combined.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const loading = !paymentHistory && !achievements;
    return { activities: combined, isLoading: loading };
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
          <ActivityItem
            key={index}
            icon={activity.icon}
            title={activity.title}
            description={activity.description}
            date={activity.date}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};