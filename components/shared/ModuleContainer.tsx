import React from 'react';

interface ModuleContainerProps {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}

const BackButton: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <button
      onClick={onBack}
      className="absolute top-4 left-4 bg-gray-200 dark:bg-gray-700 hover:bg-red-500 hover:text-white dark:hover:bg-[#CC0033] text-gray-800 dark:text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 z-10"
    >
      ← Voltar
    </button>
);

const ModuleContainer: React.FC<ModuleContainerProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-white dark:bg-black dark:bg-opacity-40 rounded-lg p-6 md:p-8 relative animate-fade-in shadow-xl dark:shadow-none">
        <BackButton onBack={onBack}/>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 text-purple-700 dark:text-[#FFD700]">{title}</h2>
      <div className="prose prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {children}
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .dark .prose-invert {
            --tw-prose-body: theme(colors.gray[300]);
            --tw-prose-headings: theme(colors.white);
            --tw-prose-lead: theme(colors.gray[400]);
            --tw-prose-links: theme(colors.white);
            --tw-prose-bold: theme(colors.white);
            --tw-prose-counters: theme(colors.gray[400]);
            --tw-prose-bullets: theme(colors.gray[600]);
            --tw-prose-hr: theme(colors.gray[700]);
            --tw-prose-quotes: theme(colors.gray[100]);
            --tw-prose-quote-borders: theme(colors.gray[700]);
            --tw-prose-captions: theme(colors.gray[400]);
            --tw-prose-code: theme(colors.white);
            --tw-prose-pre-code: theme(colors.gray[300]);
            --tw-prose-pre-bg: theme(colors.gray[900]);
            --tw-prose-th-borders: theme(colors.gray[600]);
            --tw-prose-td-borders: theme(colors.gray[700]);
        }
        .prose {
             --tw-prose-body: theme(colors.gray[700]);
            --tw-prose-headings: theme(colors.gray[900]);
            --tw-prose-lead: theme(colors.gray[600]);
            --tw-prose-links: theme(colors.gray[900]);
            --tw-prose-bold: theme(colors.gray[900]);
            --tw-prose-counters: theme(colors.gray[500]);
            --tw-prose-bullets: theme(colors.gray[400]);
            --tw-prose-hr: theme(colors.gray[200]);
            --tw-prose-quotes: theme(colors.gray[900]);
            --tw-prose-quote-borders: theme(colors.gray[200]);
            --tw-prose-captions: theme(colors.gray[500]);
            --tw-prose-code: theme(colors.gray[900]);
            --tw-prose-pre-code: theme(colors.gray[200]);
            --tw-prose-pre-bg: theme(colors.gray[800]);
            --tw-prose-th-borders: theme(colors.gray[300]);
            --tw-prose-td-borders: theme(colors.gray[200]);
        }
      `}</style>
    </div>
  );
};

export default ModuleContainer;
