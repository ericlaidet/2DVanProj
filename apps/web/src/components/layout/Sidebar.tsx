import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const links = [
    { name: 'Dashboard', to: '/' },
    { name: 'Plans', to: '/plans' },
    { name: 'Paramètres', to: '/settings' },
  ];

  return (
    <aside className={className}>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
