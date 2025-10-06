import React from 'react';
import type { Module } from '../types';
import { THEME_COLORS } from '../constants';

interface ModuleCardProps {
  module: Module;
  onSelect: () => void;
  isCompleted: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onSelect, isCompleted }) => {
  const theme = THEME_COLORS[module.theme];

  return (
    <div
      onClick={onSelect}
      className={`relative bg-white dark:bg-gray-900 dark:bg-opacity-50 border-2 ${theme.border} rounded-lg p-6 cursor-pointer transform hover:scale-105 transition-transform duration-300 flex flex-col shadow-lg dark:shadow-none`}
    >
      {isCompleted && (
        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold text-xl">
          ✓
        </div>
      )}
      <h3 className={`text-2xl font-bold ${theme.text}`}>{module.title}</h3>
      <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">{module.subtitle}</p>
      <p className="mt-4 text-gray-700 dark:text-gray-300 flex-grow">{module.description}</p>
      <div className="mt-6 text-right">
        <span className={`${theme.text} font-bold`}>Explorar →</span>
      </div>
    </div>
  );
};

export default ModuleCard;
