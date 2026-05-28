import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/LandingPage.css";

export default function LandingPage({ onShowAuth }) {
  const [activeTab, setActiveTab] = useState("login");

  const features = [
    {
      icon: "⚡",
      title: "AI-Powered",
      description: "Intelligent algorithm optimizes schedules automatically",
    },
    {
      icon: "⚙️",
      title: "Smart Constraints",
      description: "Set flexible time and resource constraints",
    },
    {
      icon: "👥",
      title: "Multi-Room Support",
      description: "Manage multiple rooms and venues efficiently",
    },
    {
      icon: "🎯",
      title: "Conflict Detection",
      description: "Automatically identifies and resolves conflicts",
    },
    {
      icon: "📊",
      title: "Real-time Analytics",
      description: "Track scheduling performance and statistics",
    },
    {
      icon: "📥",
      title: "Export Options",
      description: "Export timetables in multiple formats",
    },
  ];

  return (
    <div className="landing-page">
      <Navbar onShowAuth={onShowAuth} />

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="gradient-text">Smart Timetable</span>
              <br />
              AI-Powered Scheduling
            </h1>
            <p className="hero-subtitle">
              Generate optimal timetables effortlessly with our intelligent
              scheduling engine. Manage courses, rooms, and constraints with
              ease.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onShowAuth("signup")}
              >
                🚀 Get Started
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => onShowAuth("login")}
              >
                🔐 Sign In
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">📅</div>
              <p>Schedule</p>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">⚡</div>
              <p>Optimize</p>
            </div>
            <div className="floating-card card-3">
              <div className="card-icon">✨</div>
              <p>Perfect</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>Powerful Features</h2>
          <p>Everything you need for intelligent scheduling</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple 3-step process to create perfect timetables</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Add Courses & Rooms</h3>
            <p>Define your courses, instructors, and available venues</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Set Constraints</h3>
            <p>Configure time slots, room availability, and preferences</p>
          </div>
          <div className="step-connector">→</div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Generate & Export</h3>
            <p>Let AI generate optimal schedules and export instantly</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="section-header">
          <h2>About</h2>
          <p>Designed to simplify timetable planning for teams and institutions</p>
        </div>
        <div className="about-grid">
          <div className="about-card">
            <h3>Why it exists</h3>
            <p>
              Smart Timetable reduces manual scheduling work by bringing courses,
              rooms, and constraints into one place.
            </p>
          </div>
          <div className="about-card">
            <h3>What it helps with</h3>
            <p>
              It helps you generate conflict-aware timetables faster and review
              the result before exporting.
            </p>
          </div>
          <div className="about-card">
            <h3>How to use it</h3>
            <p>
              Add your data, set constraints, generate a timetable, and export
              the final schedule when you are ready.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to revolutionize your scheduling?</h2>
          <p>Start creating intelligent timetables today</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => onShowAuth("signup")}
          >
            Create Free Account
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
