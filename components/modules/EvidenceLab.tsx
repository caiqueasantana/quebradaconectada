import React, { useState, useEffect, useMemo, useRef } from 'react';
import ModuleContainer from '../shared/ModuleContainer';

interface EvidenceLabProps {
    onBack: () => void;
    logEvent: (event: string, data?: object) => void;
}

interface AnalysisItem {
  id: string;
  type: 'permission' | 'traffic';
  tag: 'Essencial' | 'Vigilância' | 'Perigoso';
  line: string;
  details: {
    title: string;
    description: string;
    risk: string;
    codeSnippet?: string;
  };
}

const ANALYSIS_DATA: AnalysisItem[] = [
  // APK Permissions
  { id: 'perm_internet', type: 'permission', tag: 'Essencial', line: '<uses-permission android:name="android.permission.INTERNET" />', details: { title: 'Acesso à Internet', description: 'Permissão básica para o jogo se conectar aos seus servidores.', risk: 'Baixo. Necessário para funcionalidades online.' } },
  { id: 'perm_location', type: 'permission', tag: 'Vigilância', line: '<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />', details: { title: 'Localização Precisa (GPS)', description: 'Permite que o app rastreie sua localização exata. Frequentemente usado para publicidade direcionada geograficamente ou para vender seus dados de movimentação.', risk: 'Alto. Por que um jogo precisa saber onde você está a todo momento?', codeSnippet: `// Rastreia o usuário para "ofertas especiais"\nif (hasLocationPermission()) {\n  Location userLocation = GPS.getCurrentLocation();\n  AdServer.sendData(userLocation, userProfile);\n}` } },
  { id: 'perm_contacts', type: 'permission', tag: 'Perigoso', line: '<uses-permission android:name="android.permission.READ_CONTACTS" />', details: { title: 'Ler Contatos', description: 'Permite que o app leia toda a sua lista de contatos, incluindo nomes, números e e-mails. Usado para "encontrar amigos" de forma invasiva ou para construir redes de dados para venda.', risk: 'Muito Alto. Seus dados e os de seus amigos podem ser coletados.' } },
  { id: 'perm_camera', type: 'permission', tag: 'Perigoso', line: '<uses-permission android:name="android.permission.CAMERA" />', details: { title: 'Acesso à Câmera', description: 'Permite que o app acesse sua câmera. Embora possa ser para funcionalidades de AR, também pode ser usado para espionagem.', risk: 'Crítico. O app pode tirar fotos ou gravar vídeos sem seu conhecimento explícito.', codeSnippet: `// "Verificação de ambiente" suspeita\nfunction checkEnvironment() {\n  if (user.isNotLooking()) {\n    Camera.takePicture(BACKGROUND_MODE);\n    Analytics.upload("env_snapshot");\n  }\n}` } },
  { id: 'perm_audio', type: 'permission', tag: 'Perigoso', line: '<uses-permission android:name="android.permission.RECORD_AUDIO" />', details: { title: 'Gravar Áudio', description: 'Permite que o app use o microfone para gravar áudio. Pode ser para chat de voz, mas também pode ouvir o ambiente ao seu redor.', risk: 'Crítico. Suas conversas privadas podem ser gravadas e analisadas.' } },
  
  // Network Traffic
  { id: 'net_gameserver', type: 'traffic', tag: 'Essencial', line: '1   0.512  192.168.1.10 -> 104.18.3.120   UDP      [Player Position Update]', details: { title: 'Servidor do Jogo', description: 'Comunicação essencial com o servidor principal do jogo para enviar e receber dados da partida.', risk: 'Baixo. Tráfego esperado.' } },
  { id: 'net_telemetry', type: 'traffic', tag: 'Vigilância', line: '2   1.230  192.168.1.10 -> 34.120.190.55  HTTPS    [Telemetry Data Upload]', details: { title: 'Servidor de Telemetria', description: 'Seu jogo está enviando dados sobre seu comportamento (cliques, tempo de jogo, estilo de jogo) para um servidor de análise.', risk: 'Médio. Seus hábitos estão sendo monitorados para otimizar o engajamento e a monetização, não apenas a sua diversão.' } },
  { id: 'net_googleads', type: 'traffic', tag: 'Vigilância', line: '3   2.100  192.168.1.10 -> 172.217.1.174  QUIC     [Google Ads Fetch]', details: { title: 'Rede de Anúncios Google', description: 'Conexão com os servidores da Google para baixar e exibir anúncios personalizados, baseados nos dados que eles já têm sobre você.', risk: 'Médio. Contribui para a criação de um perfil de consumidor detalhado sobre você.' } },
  { id: 'net_facebook', type: 'traffic', tag: 'Perigoso', line: '4   3.450  192.168.1.10 -> 52.84.144.156  TLSv1.2  [Facebook Analytics Ping]', details: { title: 'Analytics do Facebook', description: 'Seu jogo está enviando dados para o sistema de análise do Facebook, mesmo que você não use o Facebook para logar. Isso ajuda a empresa a rastrear suas atividades em diferentes apps.', risk: 'Alto. Rastreamento entre plataformas que centraliza ainda mais dados sobre você em uma única corporação.' } },
  { id: 'net_adjust', type: 'traffic', tag: 'Perigoso', line: '5   4.890  192.168.1.10 -> 84.17.41.112   HTTPS    [Adjust Tracking SDK]', details: { title: 'SDK de Rastreamento (Adjust)', description: 'Adjust é uma plataforma de marketing que monitora de onde você veio (qual anúncio te fez instalar o jogo) e o que você faz dentro dele. Esses dados são valiosos para empresas de publicidade.', risk: 'Alto. Seus dados de uso estão sendo enviados para um intermediário especializado em rastreamento de usuários.' } },
];

const TAG_STYLES = {
  'Essencial': 'bg-green-600 text-white',
  'Vigilância': 'bg-yellow-500 text-black',
  'Perigoso': 'bg-red-600 text-white',
};

const EvidenceLab: React.FC<EvidenceLabProps> = ({ onBack, logEvent }) => {
    const [activeTab, setActiveTab] = useState<'apk' | 'network' | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [results, setResults] = useState<AnalysisItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<AnalysisItem | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Audio Refs
    const typingAudioRef = useRef<HTMLAudioElement | null>(null);
    const alertAudioRef = useRef<HTMLAudioElement | null>(null);
    const successAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Connect refs to the audio elements in the DOM
        typingAudioRef.current = document.getElementById('typing-sound') as HTMLAudioElement;
        alertAudioRef.current = document.getElementById('alert-sound') as HTMLAudioElement;
        successAudioRef.current = document.getElementById('success-sound') as HTMLAudioElement;

        // Cleanup function to stop sounds and clear interval when component unmounts
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            typingAudioRef.current?.pause();
        };
    }, []);


    const threatLevel = useMemo(() => {
        const totalWeight = results.reduce((acc, item) => {
            if (item.tag === 'Vigilância') return acc + 1;
            if (item.tag === 'Perigoso') return acc + 2;
            return acc;
        }, 0);
        const maxWeight = ANALYSIS_DATA.filter(item => item.type === (activeTab === 'apk' ? 'permission' : 'traffic') || activeTab === null).reduce((acc, item) => {
             if (item.tag === 'Vigilância') return acc + 1;
            if (item.tag === 'Perigoso') return acc + 2;
            return acc;
        }, 0);
        return maxWeight > 0 ? (totalWeight / maxWeight) * 100 : 0;
    }, [results, activeTab]);
    
    const stopScan = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsScanning(false);
        if (typingAudioRef.current) {
            typingAudioRef.current.pause();
            typingAudioRef.current.currentTime = 0;
        }
    };

    const runScan = (type: 'apk' | 'network') => {
        stopScan(); // Ensure any previous scan is stopped

        setActiveTab(type);
        setIsScanning(true);
        setResults([]);
        setSelectedItem(null);
        logEvent(`scan_started`, { type });
        
        typingAudioRef.current?.play();

        const dataToScan = ANALYSIS_DATA.filter(item => item.type === (type === 'apk' ? 'permission' : 'traffic'));
        let index = 0;
        
        const intervalId = window.setInterval(() => {
            if (index < dataToScan.length) {
                const newItem = dataToScan[index];
                
                if (index === 0) {
                    setSelectedItem(newItem);
                }
                
                if(newItem.tag === 'Perigoso') {
                    alertAudioRef.current?.play();
                }

                setResults(prev => [...prev, newItem]);
                index++;
            } else {
                stopScan();
                successAudioRef.current?.play();
            }
        }, 500);
        intervalRef.current = intervalId;
    };

    return (
        <ModuleContainer title="Laboratório de Evidências" onBack={onBack}>
            <p className="text-lg mb-6">A vigilância deixa rastros técnicos. Use nosso terminal de análise para "escanear" um aplicativo de jogo genérico e inspecionar as permissões e conexões suspeitas que encontramos.</p>
            
            <div className="mb-4">
                <p className="font-mono text-lg mb-2">NÍVEL DE AMEAÇA DETECTADO:</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-6">
                    <div className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 h-6 rounded-full transition-all duration-500 text-center text-white font-bold flex items-center justify-center" style={{ width: `${threatLevel}%` }}>
                       {threatLevel > 10 && `${threatLevel.toFixed(0)}%`}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
                {/* Analysis Terminal */}
                <div className="bg-gray-100 dark:bg-black font-mono text-sm rounded-lg border-2 border-gray-400 dark:border-gray-600 flex flex-col p-2">
                    <div className="flex-shrink-0 flex space-x-2 p-2 bg-gray-200 dark:bg-gray-800 rounded-t-md">
                        <button onClick={() => runScan('apk')} disabled={isScanning} className={`px-4 py-1 rounded ${activeTab === 'apk' ? 'bg-[#CC0033] text-white' : 'bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'} disabled:opacity-50`}>Analisar Permissões (APK)</button>
                        <button onClick={() => runScan('network')} disabled={isScanning} className={`px-4 py-1 rounded ${activeTab === 'network' ? 'bg-[#CC0033] text-white' : 'bg-gray-400 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600'} disabled:opacity-50`}>Analisar Tráfego (Rede)</button>
                    </div>
                    <div className="flex-grow p-2 overflow-y-auto bg-gray-200 dark:bg-[#0c142b]">
                        {isScanning && <p className="text-yellow-600 dark:text-yellow-400 animate-pulse">&gt; Escaneando sistema... Por favor, aguarde.</p>}
                        {!activeTab && <p className="text-gray-500">&gt; Selecione uma análise para começar.</p>}
                        {results.map(item => (
                            <div key={item.id} onClick={() => setSelectedItem(item)} className={`flex items-center space-x-2 p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 ${selectedItem?.id === item.id ? 'bg-gray-300 dark:bg-gray-700' : ''}`}>
                                <span className={`px-2 py-0.5 text-xs rounded-full ${TAG_STYLES[item.tag]}`}>{item.tag}</span>
                                <span className="text-cyan-700 dark:text-cyan-400 flex-grow">{item.line}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inspector Panel */}
                <div className="bg-gray-200 dark:bg-[#0c142b] rounded-lg border-2 border-gray-400 dark:border-gray-600 flex flex-col">
                    <h3 className="text-lg font-bold text-yellow-600 dark:text-[#FFD700] p-3 bg-gray-300 dark:bg-gray-800 rounded-t-md">[PAINEL INSPETOR]</h3>
                    {selectedItem ? (
                        <div className="p-4 space-y-3 overflow-y-auto">
                            <div>
                                <h4 className="font-bold text-cyan-600 dark:text-cyan-300">Item:</h4>
                                <p>{selectedItem.details.title}</p>
                            </div>
                             <div>
                                <h4 className="font-bold text-cyan-600 dark:text-cyan-300">Descrição:</h4>
                                <p className="text-gray-700 dark:text-gray-300">{selectedItem.details.description}</p>
                            </div>
                             <div>
                                <h4 className="font-bold text-red-500 dark:text-red-400">Risco Associado:</h4>
                                <p className="text-gray-700 dark:text-gray-300">{selectedItem.details.risk}</p>
                            </div>
                            {selectedItem.details.codeSnippet && (
                                <div>
                                    <h4 className="font-bold text-yellow-600 dark:text-yellow-400">Código Suspeito Associado:</h4>
                                    <pre className="bg-gray-800 dark:bg-black p-2 rounded-md text-xs text-red-400 dark:text-red-300 mt-1 whitespace-pre-wrap"><code>{selectedItem.details.codeSnippet}</code></pre>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p>&gt; Clique em um item da análise para ver os detalhes.</p>
                        </div>
                    )}
                </div>
            </div>
        </ModuleContainer>
    );
};

export default EvidenceLab;
