import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return [darkMode, setDarkMode] as const;
};

