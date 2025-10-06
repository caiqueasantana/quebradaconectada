import React, { useState, useCallback, useMemo } from 'react';
import { MODULES } from './constants';
import type { Module } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import ModuleCard from './components/ModuleCard';
import Module1 from './components/modules/Module1';
import Module2 from './components/modules/Module2';
import Module3 from './components/modules/Module3';
import Module4 from './components/modules/Module4';
import EvidenceLab from './components/modules/EvidenceLab';
import WelcomeScreen from './components/WelcomeScreen';
import Certificate from './components/Certificate';
import { AccessibilityMenu, AccessibilityButton } from './components/Accessibility';
import { LibrasWidget } from './components/LibrasWidget';
import { TelemetryInspector, Log } from './components/TelemetryInspector';


type View = 'welcome' | 'main' | 'module' | 'evidence_lab' | 'certificate';

const App: React.FC = () => {
  const [view, setView] = useState<View>('welcome');
  const [userName, setUserName] = useState<string>('');
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [isAccessibilityMenuOpen, setIsAccessibilityMenuOpen] = useState(false);

  const logEvent = useCallback((event: string, data?: object) => {
    const newLog: Log = {
        timestamp: new Date().toISOString(),
        event,
        data,
    };
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const handleStart = useCallback((name: string) => {
    setUserName(name);
    setView('main');
    logEvent('session_start', { userName: name });
  }, [logEvent]);

  const handleSelectModule = useCallback((module: Module) => {
    setActiveModule(module);
    setView('module');
    logEvent('module_select', { moduleId: module.id, moduleTitle: module.title });
  }, [logEvent]);
  
  const handleShowEvidenceLab = useCallback(() => {
    setView('evidence_lab');
    setActiveModule(null);
    logEvent('evidence_lab_opened');
  }, [logEvent]);

  const handleGoBack = useCallback(() => {
    if (activeModule) {
      setCompletedModules(prev => [...new Set([...prev, activeModule.id])]);
      logEvent('module_complete', { moduleId: activeModule.id, moduleTitle: activeModule.title });
    }
    setActiveModule(null);
    setView('main');
  }, [activeModule, logEvent]);

  const handleGenerateCertificate = useCallback(() => {
    setView('certificate');
    logEvent('certificate_viewed');
  }, [logEvent]);

  const progress = useMemo(() => {
      const totalModules = MODULES.length;
      return totalModules > 0 ? (completedModules.length / totalModules) * 100 : 0;
  }, [completedModules]);
  
  const renderContent = () => {
    const moduleProps = { onBack: handleGoBack, logEvent };

    switch (view) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStart} />;
      case 'certificate':
        return <Certificate name={userName} onBack={handleGoBack} logEvent={logEvent} />;
      case 'module':
        if (activeModule) {
          switch (activeModule.id) {
            case 1: return <Module1 {...moduleProps} />;
            case 2: return <Module2 {...moduleProps} />;
            case 3: return <Module3 {...moduleProps} />;
            case 4: return <Module4 {...moduleProps} />;
          }
        }
        return null;
      case 'evidence_lab':
        return <EvidenceLab onBack={handleGoBack} logEvent={logEvent}/>;
      case 'main':
      default:
        const allModulesCompleted = MODULES.every(m => completedModules.includes(m.id));
        const labUnlocked = completedModules.length >= 2;

        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-gray-700 dark:text-gray-300">Seja bem-vindo(a), <span className="text-purple-700 dark:text-[#FFD700]">{userName}</span>! Explore os módulos abaixo.</h2>
            
            <div className="mb-8 px-4">
                <p className="text-center text-gray-600 dark:text-gray-400 mb-2">Progresso da Jornada:</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-teal-500 to-green-500 h-4 rounded-full transition-all duration-500 text-center text-white font-bold text-xs flex items-center justify-center" style={{ width: `${progress}%` }}>
                        {progress > 10 && `${progress.toFixed(0)}%`}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
              {MODULES.map((module) => (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  onSelect={() => handleSelectModule(module)}
                  isCompleted={completedModules.includes(module.id)}
                />
              ))}
              <div className="md:col-span-2">
                  <div 
                      className={`relative bg-gray-100 dark:bg-gray-800 border-2 rounded-lg p-6 transition-all duration-300 text-center group ${labUnlocked ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 border-yellow-500 dark:border-[#FFD700]' : 'border-gray-300 dark:border-gray-600 opacity-60'}`}
                      onClick={labUnlocked ? handleShowEvidenceLab : undefined}
                      aria-disabled={!labUnlocked}
                  >
                      {!labUnlocked && (
                          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg z-10">
                              <span className="text-4xl" role="img" aria-label="cadeado">🔒</span>
                              <p className="font-bold text-yellow-300 mt-2">BLOQUEADO</p>
                              <p className="text-sm text-gray-400">Complete 2 módulos para desbloquear.</p>
                          </div>
                      )}
                      <h3 className={`text-2xl font-bold uppercase tracking-wider ${labUnlocked ? 'text-yellow-600 dark:text-[#FFD700]' : 'text-gray-500'}`}>Laboratório de Evidências</h3>
                      <p className={`mt-2 ${labUnlocked ? 'text-gray-500 dark:text-gray-400' : 'text-gray-600'}`}>Veja as provas técnicas da vigilância.</p>
                  </div>
              </div>
              {allModulesCompleted && (
                 <div className="md:col-span-2 mt-8 text-center">
                    <button 
                      onClick={handleGenerateCertificate}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 px-10 rounded-lg transition-transform transform hover:scale-105 animate-pulse"
                    >
                      Parabéns! Gerar seu Certificado de Autonomia Digital
                    </button>
                 </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
      <Footer />
       <TelemetryInspector logs={logs} />
       <LibrasWidget />
       <AccessibilityButton onClick={() => setIsAccessibilityMenuOpen(true)} />
       <AccessibilityMenu isOpen={isAccessibilityMenuOpen} onClose={() => setIsAccessibilityMenuOpen(false)} />
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        html.text-sm { font-size: 14px; }
        html.text-base { font-size: 16px; }
        html.text-lg { font-size: 18px; }
      `}</style>
    </div>
  );
};

export default App;
