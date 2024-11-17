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
  // Lấy giá trị từ localStorage nếu có, nếu không thì dùng giá trị mặc định
  const [theme, setTheme] = useState(() => 
    localStorage.getItem('adminTheme') || 'light'
  );
  const [language, setLanguage] = useState(() => 
    localStorage.getItem('adminLanguage') || 'vi'
  );

  // Lưu vào localStorage khi có thay đổi
  useEffect(() => {
    localStorage.setItem('adminTheme', theme);
    // Cập nhật class cho body element
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('adminLanguage', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'vi' ? 'en' : 'vi');
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        toggleTheme,
        toggleLanguage,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};