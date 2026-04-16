import { Icon } from "@iconify/react";

interface StoreCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundColor?: string;
  iconColor?: string;
  onClick: () => void;
}

export const StoreCard = ({
  name,
  description,
  icon,
  backgroundColor = "bg-bg-secondary",
  iconColor,
  onClick,
}: StoreCardProps) => {
  // Use provided icon color or default based on background
  const finalIconColor = iconColor || "text-brand-primary";

  return (
    <div
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg bg-bg-light border border-border-color flex flex-col h-full"
    >
      {/* Showcase Area */}
      <div
        className={`${backgroundColor} h-48 flex items-center justify-center`}
      >
        <div className="p-6">
          <Icon
            icon={icon}
            width={64}
            height={64}
            className={finalIconColor}
            style={{
              color:
                finalIconColor === "text-white"
                  ? "#ffffff"
                  : finalIconColor === "text-text-primary"
                    ? "#1d1d1f"
                    : "#2255ff",
            }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            {name}
          </h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onClick();
          }}
          className="text-brand-primary hover:opacity-80 font-medium text-sm mt-4 inline-block"
        >
          Shop Now →
        </a>
      </div>
    </div>
  );
};
