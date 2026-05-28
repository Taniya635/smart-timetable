import { useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import LandingPage from "../components/LandingPage";
import AuthPage from "../components/AuthPage";

export default function Home() {
  const { onAuth } = useOutletContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const handleShowAuth = useCallback((mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  const handleCloseAuth = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const handleAuth = useCallback(
    (userData) => {
      onAuth(userData);
      handleCloseAuth();
    },
    [onAuth],
  );

  return (
    <>
      <LandingPage onShowAuth={handleShowAuth} />
      {showAuthModal && (
        <>
          <div className="modal-overlay" onClick={handleCloseAuth}></div>
          <AuthPage
            onAuth={handleAuth}
            initialMode={authMode}
            onClose={handleCloseAuth}
          />
        </>
      )}
    </>
  );
}
