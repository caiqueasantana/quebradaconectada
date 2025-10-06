import React from 'react';

const Header: React.FC = () => (
  <header className="py-6 px-4 text-center bg-white dark:bg-[#050F2C] border-b-2 border-gray-200 dark:border-[#6A0DAD] transition-colors duration-300">
    <h1 className="text-4xl md:text-5xl font-bold text-purple-700 dark:text-[#FFD700] uppercase tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
      Quebrada Conectada
    </h1>
    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">O Jogo da Autonomia Digital</p>
  </header>
);

export default Header;
