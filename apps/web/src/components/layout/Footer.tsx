import React from 'react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={className}>
      © {new Date().getFullYear()} Plan Your Van — Tous droits réservés.
    </footer>
  );
};

export default Footer;
