import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Types
type Theme = 'light' | 'dark';
type FontSize = 'sm' | 'base' | 'lg';

interface AccessibilitySettings {
  theme: Theme;
  fontSize: FontSize;
  showLibras: boolean;
}

interface AccessibilityContextType extends AccessibilitySettings {
  toggleTheme: () => void;
  setFontSize: (size: FontSize) => void;
  toggleLibras: () => void;
}

// Context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Provider
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [showLibras, setShowLibras] = useState<boolean>(false);

  useEffect(() => {
    // Load settings from localStorage on mount
    try {
        const savedSettings = localStorage.getItem('accessibilitySettings');
        if (savedSettings) {
          const { theme, fontSize, showLibras } = JSON.parse(savedSettings);
          setTheme(theme || 'dark');
          setFontSize(fontSize || 'base');
          setShowLibras(showLibras || false);
        }
    } catch (error) {
        console.error("Failed to parse accessibility settings from localStorage", error);
        // Set default values if parsing fails
        setTheme('dark');
        setFontSize('base');
        setShowLibras(false);
    }
  }, []);

  useEffect(() => {
    // Apply theme class to <html>
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply font size class to <html>
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(`text-${fontSize}`);

    // Save settings to localStorage
    localStorage.setItem('accessibilitySettings', JSON.stringify({ theme, fontSize, showLibras }));
  }, [theme, fontSize, showLibras]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);
  
  const toggleLibras = useCallback(() => {
      setShowLibras(prev => !prev);
  }, []);

  const value = { theme, toggleTheme, fontSize, setFontSize, showLibras, toggleLibras };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Hook
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Menu Component
export const AccessibilityMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme, fontSize, setFontSize, showLibras, toggleLibras } = useAccessibility();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="accessibility-menu-title">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md text-gray-900 dark:text-gray-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 id="accessibility-menu-title" className="text-2xl font-bold">Opções de Acessibilidade</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 text-3xl" aria-label="Fechar menu de acessibilidade">&times;</button>
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between py-4 border-b border-gray-300 dark:border-gray-700">
                    <span className="font-semibold">Modo Escuro</span>
                    <button onClick={toggleTheme} role="switch" aria-checked={theme === 'dark'} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-400 dark:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Font Size */}
                <div className="py-4 border-b border-gray-300 dark:border-gray-700">
                    <p className="font-semibold mb-3">Tamanho da Fonte</p>
                    <div className="flex space-x-2" role="group" aria-label="Tamanho da Fonte">
                        {(['sm', 'base', 'lg'] as FontSize[]).map(size => (
                            <button key={size} onClick={() => setFontSize(size)} className={`px-4 py-2 rounded-lg font-bold flex-1 transition-colors ${fontSize === size ? 'bg-teal-600 text-white' : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'}`}>
                                {size === 'sm' ? 'P' : size === 'base' ? 'M' : 'G'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Libras Toggle */}
                <div className="flex items-center justify-between py-4">
                    <span className="font-semibold">Ativar LIBRAS</span>
                     <button onClick={toggleLibras} role="switch" aria-checked={showLibras} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-400 dark:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                         <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${showLibras ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// Button Component
export const AccessibilityButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 right-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-3 shadow-lg z-30 transition-transform hover:scale-110"
            aria-label="Abrir opções de acessibilidade"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 16.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
                <path fillRule="evenodd" d="M10 9a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM4.646 4.646a.5.5 0 01.708 0L10 9.293l4.646-4.647a.5.5 0 01.708.708L10.707 10l4.647 4.646a.5.5 0 01-.708.708L10 10.707l-4.646 4.647a.5.5 0 01-.708-.708L9.293 10 4.646 5.354a.5.5 0 010-.708z" clipRule="evenodd" />
            </svg>
        </button>
    )
}
