import React from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import './Footer.css';

export default function Footer({ 
  showFull = true,
  onHomeClick,
  onAboutClick,
  onServicesClick,
  onTermsClick,
  onPrivacyClick,
  onSupportClick
}) {
  return (
    <footer className={`footer-container ${!showFull ? 'footer-mini' : ''}`}>
      {showFull && (
        <div className="footer-content">
        
        {/* Contact Information */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-info">
            <li>
              <MapPin className="contact-icon" size={20} />
              <span>Village Panchayat Office, Main Road, KKM District, 600001</span>
            </li>
            <li>
              <Phone className="contact-icon" size={20} />
              <span>+91 98765 43210</span>
            </li>
            <li>
              <Mail className="contact-icon" size={20} />
              <span>admin@panchayatapp.gov.in</span>
            </li>
          </ul>
        </div>

        {/* Quick Links & Feedback */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#" onClick={(e) => { e.preventDefault(); if (onHomeClick) onHomeClick(); }}>Home</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); if (onAboutClick) onAboutClick(); }}>About Village</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); if (onServicesClick) onServicesClick(); }}>Services & Schemes</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); if (onPrivacyClick) onPrivacyClick(); }}>Privacy Policy</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); if (onSupportClick) onSupportClick(); }}>Contact Support / Report Issue</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Stay Updated</h3>
          <p>Subscribe to our newsletter for the latest village news and scheme announcements.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" className="newsletter-input" required />
            <button type="submit" className="newsletter-btn">
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Map / Location & Socials */}
        <div className="footer-section">
          <h3>Find Us</h3>
          <div className="map-and-social">
            <div className="map-container" style={{ flex: 1 }}>
              <iframe 
                src="https://www.google.com/maps?q=Konerikuppam+Middle+School&output=embed" 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Village Location Map"
              ></iframe>
            </div>
            
            <div className="social-links-vertical">
              <a href="#" aria-label="Instagram" className="social-icon" title="Instagram">
                <svg fill="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Facebook" className="social-icon" title="Facebook">
                <svg fill="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                </svg>
              </a>
              <a href="#" aria-label="Threads" className="social-icon" title="Threads">
                <svg fill="currentColor" viewBox="0 0 24 24" width="22" height="22">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 15a5 5 0 1 1 5-5v-1a3 3 0 1 0-6 0v2a1 1 0 1 0 2 0v-2a1 1 0 1 1 2 0v3.5A7.508 7.508 0 0 1 12 17z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
      )}

      {/* Bottom Bar: Copyright & Legal */}
      <div className="footer-bottom">
        <div className="copyright">
          &copy; 2026 Village KKM System. All rights reserved.
        </div>
        <div className="bottom-links">
          <a href="#" onClick={(e) => { e.preventDefault(); if (onTermsClick) onTermsClick(); }}>Terms of Service</a>
          <a href="#" onClick={(e) => { e.preventDefault(); if (onPrivacyClick) onPrivacyClick(); }}>Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
