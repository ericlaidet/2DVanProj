// apps/web/src/components/ui/Notification.tsx
import React from 'react';

const Notification: React.FC<{ message: string; type?: 'info'|'success'|'error' }> = ({ message, type = 'info' }) => {
  const bg = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`${bg} text-white px-4 py-2 rounded fixed top-4 right-4 shadow-lg`}>
      {message}
    </div>
  );
};

export default Notification;
