import React, { useState } from 'react';
import { useAccessibility } from './Accessibility';

export const LibrasWidget: React.FC = () => {
    const { showLibras } = useAccessibility();
    const [isOpen, setIsOpen] = useState(false);

    if (!showLibras) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-20 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg z-30 transition-transform hover:scale-110"
                aria-label={isOpen ? "Fechar janela de LIBRAS" : "Abrir janela de LIBRAS"}
                aria-expanded={isOpen}
            >
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 11h-4a2 2 0 00-2 2v2a2 2 0 002 2h4v-1a2 2 0 00-2-2h-2"/>
                    <path d="M11 11V9a2 2 0 012-2h4"/>
                    <path d="M4 11h4"/>
                    <path d="M4 15h4"/>
                    <path d="M10 5L8 7l2 2"/>
                </svg>
            </button>

            {isOpen && (
                <div className="fixed bottom-4 left-4 w-80 h-64 bg-gray-100 dark:bg-gray-900 border-2 border-blue-500 rounded-lg shadow-2xl z-40 flex flex-col animate-fade-in">
                    <div className="bg-gray-200 dark:bg-gray-800 p-2 flex justify-between items-center cursor-move">
                        <h3 className="text-gray-800 dark:text-white font-bold">LIBRAS</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-800 dark:text-white hover:text-red-500 text-2xl" aria-label="Fechar janela LIBRAS">&times;</button>
                    </div>
                    <div className="flex-grow flex items-center justify-center bg-gray-300 dark:bg-black">
                        <p className="text-gray-600 dark:text-gray-400 text-center p-4">Espaço para o vídeo do intérprete de LIBRAS.</p>
                        {/* Placeholder for video */}
                    </div>
                </div>
            )}
        </>
    );
};
