import "../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
    Company: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
    ],
    Support: [
      { label: "Help Center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">📅</div>
            <div>
              <div className="footer-title">Smart Timetable</div>
              <p className="footer-description">
                AI-powered intelligent scheduling solution for educational
                institutions
              </p>
            </div>
          </div>

          <div className="footer-links-grid">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="footer-column">
                <h4>{category}</h4>
                <ul>
                  {links.map((link, index) => (
                    <li key={index}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© {currentYear} Smart Timetable. All rights reserved.</p>
          </div>
          <div className="footer-social">
            <a href="#" className="social-link" title="Twitter">
              𝕏
            </a>
            <a href="#" className="social-link" title="LinkedIn">
              in
            </a>
            <a href="#" className="social-link" title="GitHub">
              ⚙️
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
