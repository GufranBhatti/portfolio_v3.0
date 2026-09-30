import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// Defaults to dark — that's the site's actual identity, not something that
// should silently flip based on OS preference for a first-time visitor.
// Only respects a previously saved choice.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    return localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
  });

  // The actual flip is deferred to ThemeTransition.jsx's plug-in/plug-out
  // animation — toggling the switch doesn't change `theme` immediately.
  // `requestToggle` only arms `pendingTheme`; the overlay calls
  // `commitPendingTheme` at the moment the mascot's plug connects/disconnects.
  const [pendingTheme, setPendingTheme] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const requestToggle = () => {
    if (isTransitioning) return;
    setPendingTheme(theme === 'dark' ? 'light' : 'dark');
    setIsTransitioning(true);
  };

  const commitPendingTheme = () => {
    setTheme((current) => pendingTheme || (current === 'dark' ? 'light' : 'dark'));
  };

  const endTransition = () => {
    setIsTransitioning(false);
    setPendingTheme(null);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme: requestToggle, isTransitioning, pendingTheme, commitPendingTheme, endTransition }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
