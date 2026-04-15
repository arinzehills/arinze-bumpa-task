import { ToastContainer, toast } from "react-toastify";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
};

interface ToastOptions {
  title?: string;
  message: string;
  duration?: number;
}

export const SideToast = {
  FireSuccess: ({ title = "Success", message }: ToastOptions) => {
    toast.success(
      <div className="flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-white">{message}</p>
        </div>
      </div>,
      {
        style: { background: "rgba(0, 0, 0, 0.9)" },
        closeButton: <X className="w-4 h-4 text-white" />,
      },
    );
  },

  FireError: ({ title = "Error", message }: ToastOptions) => {
    toast.error(
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-white" style={{ color: "white" }}>
            {message}
          </p>
        </div>
      </div>,
      {
        style: { background: "rgba(0, 0, 0, 0.9)" },
        closeButton: <X className="w-4 h-4 text-white" />,
      },
    );
  },

  FireWarning: ({ title = "Warning", message }: ToastOptions) => {
    toast.warning(
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-white">{message}</p>
        </div>
      </div>,
      {
        style: { background: "rgba(0, 0, 0, 0.9)" },
        closeButton: <X className="w-4 h-4 text-white" />,
      },
    );
  },

  FireInfo: ({ title = "Info", message }: ToastOptions) => {
    toast.info(
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-white">{message}</p>
        </div>
      </div>,
      {
        style: { background: "rgba(0, 0, 0, 0.9)" },
        closeButton: <X className="w-4 h-4 text-white" />,
      },
    );
  },
};
