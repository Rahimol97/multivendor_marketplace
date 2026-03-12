import { createContext, useContext, useState } from "react";

export function createThemeContext(storageKey) {
  const ThemeContext = createContext();

  const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(
      () => localStorage.getItem(storageKey) === "dark"
    );

    const toggleTheme = () => {
      setDarkMode((prev) => {
        const next = !prev;
        localStorage.setItem(storageKey, next ? "dark" : "light");
        return next;
      });
    };

    return (
      <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
        {/* Scoped dark mode (PER ROLE) */}
        <div className={darkMode ? "dark" : ""}>
          {children}
        </div>
      </ThemeContext.Provider>
    );
  };

  const useTheme = () => useContext(ThemeContext);

  return { ThemeProvider, useTheme };
}