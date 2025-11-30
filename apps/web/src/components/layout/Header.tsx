import React from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const userName = useStore(s => s.userName);
  const subscription = useStore(s => s.subscription);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={`app-header-new ${className || ''}`}>
      <div className="header-content-new">
        {/* Titre à gauche */}
        <h1 className="header-title-new">Plan your Van - Éditeur 2D</h1>

        {/* User info + Navigation à droite */}
        <div className="header-right">
          <div className="user-info-new">
            <span>Bienvenue, <strong>{userName || "user"}</strong> - Abonnement: <strong>{subscription}</strong></span>
          </div>
          
          <nav className="header-nav-new">
            <button
              className="nav-btn-new"
              onClick={() => navigate("/plans")}
            >
              Plans
            </button>

            <button
              className="nav-btn-new"
              onClick={() => navigate("/profile")}
            >
              Profil
            </button>
            
            <button
              className="nav-btn-new"
              onClick={() => navigate("/settings")}
            >
              Paramètres
            </button>

            <button
              className="nav-btn-new nav-btn-logout"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
