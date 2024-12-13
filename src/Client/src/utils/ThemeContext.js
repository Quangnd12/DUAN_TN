import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('clientLanguage') || 'vi'
  );

  // Lưu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('clientLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'vi' ? 'en' : 'vi');
  };

  return (
    <ThemeContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};