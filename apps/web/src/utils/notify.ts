// apps/web/src/utils/notify.ts
import toast from 'react-hot-toast';

export const notify = {
  success: (msg: string) =>
    toast.success(msg, {
      position: 'top-center',
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.9rem',
      },
    }),

  error: (msg: string) =>
    toast.error(msg, {
      position: 'top-center',
      style: {
        background: '#ef4444',
        color: '#fff',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.9rem',
      },
    }),

  info: (msg: string) =>
    toast(msg, {
      position: 'top-center',
      style: {
        background: '#3b82f6',
        color: '#fff',
        borderRadius: '8px',
        padding: '10px 14px',
        fontSize: '0.9rem',
      },
    }),
};
