import { useEffect, useState } from "react";
import "./toast.css";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let globalAddToast: ((msg: string, type: ToastType) => void) | any;

export const showToast = (message: string, type: ToastType = "info") => {
  if (globalAddToast) globalAddToast(message, type);
};

const ToastProvider = () => {
  const [toast, setToast] = useState<ToastItem[]>([]);

  useEffect(() => {
    globalAddToast = (message: any, type: any) => {
      const id = ++toastId;
      setToast((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToast((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    return () => {
      globalAddToast = null;
    };
  }, []);

  const icons: Record<ToastType, string> = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  };

  return (
    <div className="toast-container">
      {toast.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
