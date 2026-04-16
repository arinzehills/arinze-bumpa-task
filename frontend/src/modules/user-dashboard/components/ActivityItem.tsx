import { memo } from "react";

interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  date: string;
  index: number;
}

const ActivityItem = memo(({ icon, title, description, date }: ActivityItemProps) => {
  return (
    <div className="flex items-center gap-4 pb-4 border-b border-border-color last:border-0">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1">
        <p className="font-semibold text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <div className="text-xs text-text-muted text-right">{date}</div>
    </div>
  );
});

ActivityItem.displayName = "ActivityItem";

export default ActivityItem;