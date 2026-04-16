import React, { ReactNode } from "react";
import AnimatedModal from "./AnimatedModal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@components/Button";

export const ActionType = {
  INFO: "info",
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  DELETE: "delete",
} as const;

export type ActionTypeValue = (typeof ActionType)[keyof typeof ActionType];

const ICON_MAP = {
  success: {
    icon: "ph:check-circle-fill",
    color: "text-green-400",
    bgColor: "bg-green-100",
  },
  warning: {
    icon: "ph:warning-fill",
    color: "text-yellow-400",
    bgColor: "bg-yellow-100",
  },
  danger: {
    icon: "hugeicons:cancel-01",
    color: "text-red-400",
    bgColor: "bg-red-100",
  },
  delete: {
    icon: "fluent:delete-48-regular",
    color: "text-red-400",
    bgColor: "bg-red-100",
  },
  info: {
    icon: "ph:info-fill",
    color: "text-blue-300",
    bgColor: "bg-blue-100",
  },
};

export interface ConfirmModalProps {
  openModal?: boolean;
  setOpenModal: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
  message?: string;
  type?: ActionTypeValue;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
  modalHeight?: number;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  openModal = false,
  setOpenModal,
  onConfirm,
  loading = false,
  title,
  message,
  type = ActionType.INFO,
  confirmText = "OK",
  cancelText = "Cancel",
  children,
  modalHeight = 350,
}) => {
  const iconConfig = ICON_MAP[type];

  return (
    <AnimatedModal
      modalHeight={modalHeight}
      openModal={openModal}
      setOpenModal={setOpenModal}
      isCircular={false}
      canClose={true}
      maxWidthClass="max-w-md p-6"
    >
      <div className="pb-8 flex items-center justify-center flex-col gap-4 w-full">
        <div
          className={`${iconConfig.bgColor}  rounded-full flex items-center justify-center w-16 h-16 text-center`}
        >
          <Icon
            icon={iconConfig.icon}
            className={`${iconConfig.color} text-3xl`}
          />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-center">
            {title ?? "Confirm!"}
          </h3>

          <span className="text-center text-gray-600 text-sm mt-2">
            {message ?? "Did you want to continue?"}
          </span>
        </div>
        {children && <div className="w-full">{children}</div>}
        <div className="flex flex-col gap-3 w-full mt-2">
          <Button variant="secondary" onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
          <Button variant="danger" onClick={() => setOpenModal(false)}>
            {cancelText}
          </Button>
        </div>
      </div>
    </AnimatedModal>
  );
};

export default ConfirmModal;
