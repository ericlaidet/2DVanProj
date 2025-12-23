import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsMenu.css';

const SettingsMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <div className="settings-dropdown" ref={dropdownRef}>
            <button
                className={`nav-btn-new ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                Paramètres <span className="dropdown-arrow">▼</span>
            </button>

            {isOpen && (
                <div className="dropdown-menu-list">
                    <button
                        className="dropdown-item"
                        onClick={() => handleNavigate('/settings')}
                    >
                        👤 Paramètres utilisateur
                    </button>
                    <button
                        className="dropdown-item"
                        onClick={() => handleNavigate('/guide')}
                    >
                        📖 Afficher le guide
                    </button>
                </div>
            )}
        </div>
    );
};

export default SettingsMenu;
