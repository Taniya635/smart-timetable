import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getMe, logout } from "./api/api";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  // Verify auth on mount
  useEffect(() => {
    getMe()
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setAuthReady(true);
      });
  }, []);

  // Redirect based on auth status
  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      navigate("/", { replace: true });
    }
  }, [user, authReady, navigate]);

  const handleAuth = (userData) => {
    setUser(userData);
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore errors
    }
    setUser(null);
    navigate("/", { replace: true });
  };

  if (!authReady) {
    return null;
  }

  return (
    <>
      <Outlet
        context={{
          user,
          authReady,
          onAuth: handleAuth,
          onLogout: handleLogout,
          addToast,
        }}
      />

      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && "✅ "}
            {t.type === "error" && "❌ "}
            {t.type === "warning" && "⚠️ "}
            {t.message}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
