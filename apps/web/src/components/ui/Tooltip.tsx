// apps/web/src/components/ui/Tooltip.tsx
import React from 'react';

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => {
  return (
    <div className="relative group inline-block">
      {children}
      <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity z-50">
        {content}
      </div>
    </div>
  );
};

export default Tooltip;
