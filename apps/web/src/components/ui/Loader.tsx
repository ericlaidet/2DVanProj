// apps/web/src/components/ui/Loader.tsx
import React from 'react';

const Loader: React.FC<{ size?: number }> = ({ size = 36 }) => {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', border: `${Math.max(3, Math.round(size/8))}px solid #eee`, borderTop: `${Math.max(3, Math.round(size/8))}px solid #3b82f6` }} className="animate-spin" />
  );
};

export default Loader;
