import React, { useState } from 'react';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in p-4">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200">Bem-vindo(a) à sua jornada pela</h2>
      <h1 className="text-4xl md:text-6xl font-bold text-purple-700 dark:text-[#FFD700] uppercase tracking-widest my-4" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
        Autonomia Digital
      </h1>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-400 mb-8">
        Este é um espaço de aprendizado interativo para desmascarar a vigilância nos jogos e fortalecer nossa segurança. Para começar, diga-nos seu nome:
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Digite seu nome ou apelido"
          className="w-full bg-gray-200 dark:bg-gray-800 border-2 border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-[#FFD700] text-gray-800 dark:text-white text-center text-xl p-4 rounded-lg focus:outline-none transition-colors"
          aria-label="Seu nome"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-4 w-full bg-green-700 dark:bg-[#008000] hover:bg-green-800 dark:hover:bg-green-700 text-white font-bold text-2xl py-4 rounded-lg transition-all duration-300 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
        >
          Iniciar Jornada
        </button>
      </form>
    </div>
  );
};

export default WelcomeScreen;
