import { useState } from "react";
import "../styles/Navbar.css";

export default function Navbar({ onShowAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a
          className="navbar-brand"
          href="#home"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="navbar-logo">📅</div>
          <div>
            <div className="navbar-title">Smart Timetable</div>
            <div className="navbar-subtitle">AI Scheduler</div>
          </div>
        </a>

        <div className={`navbar-menu ${mobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="navbar-links">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="navbar-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                onShowAuth("login");
                setMobileMenuOpen(false);
              }}
              id="nav-login-btn"
            >
              Sign In
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                onShowAuth("signup");
                setMobileMenuOpen(false);
              }}
              id="nav-signup-btn"
            >
              Sign Up
            </button>
          </div>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="navbar-toggle"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
