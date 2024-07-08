// src/utils/showToast.ts

import { toast } from "react-hot-toast";
import ToastIcon from "./ToastIcon";

export const showToast = (
  type: "success" | "error" | "warn" | "info",
  message: string,
  duration?: number,
) => {
  const styles = {
    success: {
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#4CAF50", // Green color for success messages
      color: "#FFFFFF", // White text color
    },
    error: {
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#F44336", // Red color for error messages
      color: "#FFFFFF", // White text color
    },
    warn: {
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#FF9800", // Orange color for warning messages
      color: "#FFFFFF", // White text color
    },
    info: {
      borderRadius: "8px",
      padding: "12px",
      backgroundColor: "#2196F3", // Blue color for info messages
      color: "#FFFFFF", // White text color
    },
  };

  return toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
        style={styles[type]}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <ToastIcon type={type} />
          </div>
          <div className="ml-3 flex-1 pt-0.5">
            <p className="text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    ),
    { duration },
  );
};
