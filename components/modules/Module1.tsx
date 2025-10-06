import React, { useState, useCallback, useEffect, useRef } from 'react';
import ModuleContainer from '../shared/ModuleContainer';

interface TelemetryLog {
  id: number;
  timestamp: string;
  event: string;
  data: Record<string, any>;
}

interface PredictiveProfile {
    engagement: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
    location: string;
    clickPattern: 'Esporádico' | 'Constante' | 'Frenético';
    estimatedAge: '13-17' | '18-24' | '25+';
}

interface Module1Props {
    onBack: () => void;
    logEvent: (event: string, data?: object) => void;
}

const Module1: React.FC<Module1Props> = ({ onBack, logEvent }) => {
  const [clicks, setClicks] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [profile, setProfile] = useState<PredictiveProfile>({
      engagement: 'Baixo',
      location: 'Carapicuíba, BR (inferido)',
      clickPattern: 'Esporádico',
      estimatedAge: '13-17',
  });
  const lastClickTime = useRef<number>(0);

  const handleClick = useCallback(() => {
    const newClickCount = clicks + 1;
    const currentTime = performance.now();
    const timeSinceLastClick = currentTime - lastClickTime.current;
    lastClickTime.current = currentTime;

    setClicks(newClickCount);
    const generatedData = Math.floor(Math.random() * 10) + 5;
    setDataPoints(prev => prev + generatedData);
    
    const newLog: TelemetryLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      event: 'player_interaction',
      data: {
        type: 'button_click',
        click_count: newClickCount,
        session_time_ms: Math.round(currentTime),
        location_guess: 'Carapicuíba, BR',
        time_since_last_click_ms: Math.round(timeSinceLastClick),
      }
    };

    logEvent('game_click', {
        clicks: newClickCount,
        generatedData,
        timeSinceLast_ms: Math.round(timeSinceLastClick),
    });
    
    setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 9)]);

    // Update Predictive Profile
    setProfile(prevProfile => {
        let newEngagement = prevProfile.engagement;
        if (newClickCount > 50) newEngagement = 'Muito Alto';
        else if (newClickCount > 20) newEngagement = 'Alto';
        else if (newClickCount > 5) newEngagement = 'Médio';

        let newClickPattern = prevProfile.clickPattern;
        if (timeSinceLastClick < 150) newClickPattern = 'Frenético';
        else if (timeSinceLastClick < 500) newClickPattern = 'Constante';
        else newClickPattern = 'Esporádico';
        
        let newEstimatedAge = prevProfile.estimatedAge;
        if (newClickPattern === 'Frenético' && newEngagement === 'Muito Alto') newEstimatedAge = '13-17';
        else if (newClickPattern === 'Constante') newEstimatedAge = '18-24';
        else newEstimatedAge = '25+';

        return { ...prevProfile, engagement: newEngagement, clickPattern: newClickPattern, estimatedAge: newEstimatedAge };
    });

  }, [clicks, logEvent]);

  return (
    <ModuleContainer title="Módulo 1: O Lazer que Vira Labuta" onBack={onBack}>
      <p className="text-lg mb-6">
        Bem-vindo ao "jogo". A cada clique, você gera valor. Não para você, mas para a plataforma. Observe em tempo real como seu comportamento é transformado em dados e em um perfil preditivo sobre você. Isso é o <strong>Capitalismo de Vigilância</strong> em ação.
      </p>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Telemetry Backend Panel */}
        <div className="lg:col-span-1 bg-gray-100 dark:bg-[#0c142b] p-4 rounded-lg border-2 border-[#CC0033]">
          <h3 className="text-xl font-bold text-[#CC0033] font-mono text-center mb-2">[PAINEL DE TELEMETRIA]</h3>
          <div className="bg-gray-200 dark:bg-black font-mono text-sm text-green-600 dark:text-green-400 p-4 rounded h-96 overflow-y-auto">
            {logs.length === 0 && <p className="text-gray-500">&gt; Aguardando dados do jogador...</p>}
            {logs.map(log => (
              <div key={log.id} className="mb-2 whitespace-pre-wrap break-words">
                <p className="text-yellow-600 dark:text-yellow-500">{log.timestamp}</p>
                <p>&gt; Evento: <span className="text-cyan-600 dark:text-cyan-400">{log.event}</span></p>
                <p>&gt; Dados: <span className="text-gray-800 dark:text-white">{JSON.stringify(log.data)}</span></p>
              </div>
            ))}
          </div>
        </div>

         {/* Interactive Game Panel */}
        <div className="lg:col-span-1 bg-gray-200 dark:bg-gray-800 p-6 rounded-lg border-2 border-purple-400 dark:border-[#6A0DAD] text-center">
          <h3 className="text-xl font-bold text-purple-700 dark:text-[#FFD700]">Área de Jogo</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Clique para gerar "diversão"!</p>
          <button
            onClick={handleClick}
            className="bg-[#FFD700] text-[#050F2C] font-bold py-4 px-8 rounded-full text-2xl transform hover:scale-110 transition-transform duration-200"
          >
            Clique Aqui!
          </button>
          <div className="flex justify-around mt-4">
            <div>
              <p className="text-5xl font-bold text-gray-800 dark:text-white">{clicks}</p>
              <p className="text-gray-600 dark:text-gray-300">Seus Cliques</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#CC0033]">{dataPoints}</p>
              <p className="text-gray-600 dark:text-gray-300">Pontos de Dados Gerados</p>
            </div>
          </div>
        </div>

        {/* Predictive Profile Panel */}
        <div className="lg:col-span-1 bg-gray-100 dark:bg-[#0c142b] p-4 rounded-lg border-2 border-yellow-500">
            <h3 className="text-xl font-bold text-yellow-500 dark:text-yellow-400 font-mono text-center mb-4">[PERFIL PREDITIVO EM TEMPO REAL]</h3>
            <div className="space-y-4 text-lg">
                <div className="bg-gray-200 dark:bg-black p-3 rounded">
                    <p className="text-gray-500 font-mono text-sm">NÍVEL DE ENGAJAMENTO:</p>
                    <p className="font-bold text-gray-800 dark:text-white">{profile.engagement}</p>
                </div>
                <div className="bg-gray-200 dark:bg-black p-3 rounded">
                    <p className="text-gray-500 font-mono text-sm">PADRÃO DE CLIQUE:</p>
                    <p className="font-bold text-gray-800 dark:text-white">{profile.clickPattern}</p>
                </div>
                <div className="bg-gray-200 dark:bg-black p-3 rounded">
                    <p className="text-gray-500 font-mono text-sm">LOCALIZAÇÃO INFERIDA:</p>
                    <p className="font-bold text-gray-800 dark:text-white">{profile.location}</p>
                </div>
                <div className="bg-gray-200 dark:bg-black p-3 rounded">
                    <p className="text-gray-500 font-mono text-sm">IDADE ESTIMADA:</p>
                    <p className="font-bold text-gray-800 dark:text-white">{profile.estimatedAge}</p>
                </div>
            </div>
        </div>

      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-teal-600 dark:text-[#00FFFF] mb-2">O que está acontecendo?</h3>
        <p>Veja como um único clique gera múltiplos pontos de dados. Enquanto você se diverte, ferramentas como <strong>PlayFab</strong> ou <strong>Google Spanner</strong> coletam cada ação sua. Elas não servem apenas para melhorar o jogo, mas para criar um perfil detalhado sobre você. Esse perfil pode ser usado para te manter jogando (e gastando) mais, ou vendido para outras empresas. A <strong>Psicopolítica</strong> descreve como a exploração hoje ocorre através do prazer e da auto-otimização, transformando o jogo em uma forma de trabalho não remunerado.</p>
      </div>
    </ModuleContainer>
  );
};

export default Module1;
