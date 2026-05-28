import { useCallback, useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  const value = { toasts, addToast };

  return <>{children}</>;
}
