// apps/web/src/components/ui/Tooltip.tsx
import React from 'react';
import './Tooltip.css';

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-text">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
