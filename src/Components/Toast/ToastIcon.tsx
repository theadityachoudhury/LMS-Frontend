// ToastIcon.tsx

import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

const ToastIcon = ({
  type,
}: {
  type: "success" | "error" | "warn" | "info";
}) => {
  switch (type) {
    case "success":
      return <CheckCircle className="text-white" />;
    case "error":
      return <XCircle className="text-white" />;
    case "warn":
      return <AlertTriangle className="text-white" />;
    case "info":
      return <Info className="text-white" />;
    default:
      return null;
  }
};

export default ToastIcon;
