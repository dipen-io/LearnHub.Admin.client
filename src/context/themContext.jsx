import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const defaultTheme = 'white';
  const [theme, setTheme] = useState(defaultTheme);

useEffect(() => {
  const savedTheme = localStorage.getItem('theme') || defaultTheme;
  const saveStyle = localStorage.getItem("style") || "flip";
    document.documentElement.dataset.theme = savedTheme;
    document.documentElement.dataset.style = saveStyle;
    setTheme(savedTheme);
}, []);

// Theme toggle with View Transition
  const toggleTheme = () => {
    if (!document.startViewTransition) {
      console.warn('View Transitions API not supported');
      applyTheme(theme === 'light' ? 'dark' : 'light');
      return;
    }

    document.startViewTransition(() => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    });
  };

  const setStyle = (style) => {
    document.documentElement.dataset.style = style;
    localStorage.setItem('style', style);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setStyle }}>
      {children}
    </ThemeContext.Provider>
  );
};

