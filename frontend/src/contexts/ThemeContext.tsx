import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme } from 'styles/themes/light';
import { darkTheme } from 'styles/themes/dark';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getInitialTheme = (): ThemeMode => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light'; // fallback เป็น light
  };

  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem('theme', themeMode);
  }, [themeMode]);
useEffect(() => {
  console.log('🎨 Current Theme Mode:', themeMode); // <-- ตรงนี้
}, [themeMode]);
  // **เพิ่ม useEffect ตัวนี้เพื่อตรวจจับการเปลี่ยนแปลง theme ใน localStorage จากแท็บอื่น**
  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === 'theme' && (event.newValue === 'light' || event.newValue === 'dark')) {
        setThemeMode(event.newValue);
      }
    };

    window.addEventListener('storage', onStorageChange);
    return () => window.removeEventListener('storage', onStorageChange);
  }, []);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = themeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};


export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
