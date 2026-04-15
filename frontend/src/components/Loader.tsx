import { Icon } from "@iconify/react";

interface LoaderProps {
  isCentralized?: boolean;
  size?: string;
}

export const Loader = ({ isCentralized = true, size }: LoaderProps) => {
  return (
    <div
      className={`${
        isCentralized ? "h-[60vh] flex items-center justify-center" : ""
      }`}
    >
      <div
        className={`${size ?? "w-24 h-24"} bg-brand-primary text-white  rounded-full flex flex-col items-center justify-center`}
      >
        <Icon icon="ph:spinner" className="animate-spin h-10 w-10" />
      </div>
    </div>
  );
};
