import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Besoin d'aide ?</h4>
          <ul>
            <li><Link to="/about">À propos</Link></li>
            <li><Link to="/settings">Guide d'utilisation</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Newsletter</h4>
          <p>Recevez nos derniers conseils pour aménager votre van.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Votre email" className="newsletter-input" />
            <button className="btn btn-blue newsletter-btn">S'abonner</button>
          </div>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@vplanner.com</p>
          <div className="social-links">
            <span className="social-icon">Instagram</span>
            <span className="social-icon">Facebook</span>
            <span className="social-icon">YouTube</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Van Planner Pro. Tous droits réservés.</p>
        <div className="footer-legal">
          <Link to="/terms">CGU</Link> | <Link to="/privacy">Confidentialité</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
