import React, { useState, useEffect, useRef } from 'react';
import ModuleContainer from '../shared/ModuleContainer';

interface Module2Props {
    onBack: () => void;
    logEvent: (event: string, data?: object) => void;
}

// --- SUBCOMPONENTS ---

const Terminal: React.FC<{ lines: string[]; onComplete?: () => void }> = ({ lines, onComplete }) => {
    const [currentLines, setCurrentLines] = useState<string[]>([]);
    
    useEffect(() => {
        setCurrentLines([]); // Reset on new lines
        const interval = setInterval(() => {
            setCurrentLines(prev => {
                const nextIndex = prev.length;
                if (nextIndex < lines.length) {
                    return [...prev, lines[nextIndex]];
                } else {
                    clearInterval(interval);
                    if (onComplete) onComplete();
                    return prev;
                }
            });
        }, 600);
        return () => clearInterval(interval);
    }, [lines, onComplete]);

    return (
        <div className="bg-black font-mono text-sm text-green-400 p-4 rounded-lg h-64 overflow-y-auto">
            {currentLines.map((line, i) => (
                <p key={i} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: line }} />
            ))}
             <div className="animate-pulse">_</div>
        </div>
    );
};

const MalwareAlert: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const alertLines = [
        '<span class="text-yellow-400">> ConnectionBooster.exe running...</span>',
        '<span class="text-yellow-400">> Granting admin privileges... DONE.</span>',
        '<span class="text-red-500">[!] Bypassing firewall... SUCCESS.</span>',
        '<span class="text-red-500">[!] Searching for sensitive files...</span>',
        '  > Found: C:\\Users\\Player\\Documents\\senhas.txt',
        '  > Found: C:\\Users\\Player\\Pictures\\privado\\',
        '<span class="text-red-500">[!] Accessing browser cookies... COPIED.</span>',
        '<span class="text-red-500">[!] Activating webcam... SILENT_MODE_ON.</span>',
        '<span class="text-white bg-red-600 p-1">>>> PAYLOAD DEPLOYED: Trojan.Keylogger.Gen <<<</span>',
        '<span class="text-red-500">[!] Installing keylogger... CAPTURING KEYSTROKES.</span>',
        '<span class="text-yellow-400">> Your device is now compromised.</span>',
    ];
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1a0000] border-4 border-double border-red-500 rounded-lg max-w-2xl w-full p-6 animate-fade-in text-center shadow-lg shadow-red-500/50">
                <h2 className="text-4xl font-bold text-red-500 font-mono animate-pulse">! VIOLAÇÃO DE SEGURANÇA !</h2>
                <div className="mt-4">
                    <Terminal lines={alertLines} />
                </div>
                <button 
                    onClick={onClose}
                    className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl py-3 px-10 rounded-lg transition-transform transform hover:scale-105"
                >
                    Finalizar Simulação (Ufa!)
                </button>
            </div>
        </div>
    );
};

const FakeDownload: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Baixando...');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setStatus('Instalando...');
                    setTimeout(() => {
                        clearInterval(interval);
                        onComplete();
                    }, 1500);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40 p-4">
            <div className="bg-gray-700 dark:bg-gray-800 p-6 rounded-lg border-2 border-blue-500 w-full max-w-md">
                <h3 className="text-xl font-bold text-white mb-2">ConnectionBooster_v2.1.exe</h3>
                <p className="text-gray-400 mb-4">{status}</p>
                <div className="w-full bg-gray-600 rounded-full h-4">
                    <div className="bg-blue-500 h-4 rounded-full transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-gray-400 mt-2 text-sm">{(progress * 2.55).toFixed(1)} MB de 255.0 MB</p>
                {status === 'Instalando...' && <p className="text-yellow-400 mt-2 text-center animate-pulse">Aguarde, otimizando seu sistema...</p>}
            </div>
        </div>
    );
};

const CVE_DATA = [
    {
        title: "Log4Shell (Minecraft)",
        cve: "CVE-2021-44228",
        description: "Uma falha crítica na biblioteca de logs 'Log4j', usada por milhões de softwares, incluindo servidores de Minecraft. Apenas enviar uma mensagem no chat do jogo podia permitir que um invasor executasse qualquer código no computador da vítima, tomando controle total.",
        risk: "Crítico"
    },
    {
        title: "Steam Sockets RCE",
        cve: "CVE-2022-34749",
        description: "Uma vulnerabilidade no sistema de rede do Steam (usado por jogos como CS:GO e Dota 2) que podia ser explorada ao simplesmente convidar a vítima para uma partida. Isso permitia a Execução Remota de Código (RCE), dando ao atacante controle sobre o PC do jogador.",
        risk: "Crítico"
    }
];

const CVECard: React.FC<{ cve: typeof CVE_DATA[0] }> = ({ cve }) => (
    <div className="bg-gray-800 p-4 rounded-lg border-l-4 border-red-500">
        <h4 className="text-xl font-bold text-red-400">{cve.title}</h4>
        <p className="font-mono text-sm text-yellow-400 mt-1">{cve.cve}</p>
        <p className="mt-2 text-gray-300">{cve.description}</p>
    </div>
);


// --- MAIN COMPONENT ---

const Module2: React.FC<Module2Props> = ({ onBack, logEvent }) => {
  const [showMalwareAlert, setShowMalwareAlert] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(false);

  const diagnosticLines = [
      '> Pinging game.server.com [104.18.3.120]...',
      '  Reply from 104.18.3.120: bytes=32 time=289ms TTL=54',
      '<span class="text-red-500">  Request timed out.</span>',
      '  Reply from 104.18.3.120: bytes=32 time=350ms TTL=54',
      '<span class="text-red-500">  Request timed out.</span>',
      '> Ping statistics: Packets: Sent = 4, Received = 2, Lost = 2 (<span class="text-red-500">50% loss</span>)',
      '> ',
      '<span class="text-yellow-400">> CONNECTION UNSTABLE. HIGH LATENCY AND PACKET LOSS DETECTED.</span>'
  ];
  
  const handleDownload = () => {
    setIsDownloading(true);
    logEvent('malware_simulation_triggered');
  };

  const handleDownloadComplete = () => {
      setIsDownloading(false);
      setShowMalwareAlert(true);
  };

  return (
    <ModuleContainer title="Módulo 2: Infraestrutura da Vulnerabilidade" onBack={onBack}>
      {isDownloading && <FakeDownload onComplete={handleDownloadComplete} />}
      {showMalwareAlert && <MalwareAlert onClose={() => setShowMalwareAlert(false)} />}
      
      <p className="text-lg mb-6">
        Em muitas periferias, a internet é precária. Isso não afeta só sua gameplay com lag, mas também sua segurança. Uma conexão instável pode te levar a buscar "soluções" perigosas e te torna um alvo fácil para ataques. Veja a simulação.
      </p>

      <div className="bg-gray-900 dark:bg-black p-6 rounded-lg border-2 border-[#CC0033] shadow-lg">
          <h3 className="text-xl font-bold text-center text-[#CC0033] mb-4 font-mono">[DIAGNÓSTICO DE REDE EM TEMPO REAL]</h3>
          <Terminal lines={diagnosticLines} onComplete={() => setShowDownloadPrompt(true)} />

          {showDownloadPrompt && (
              <div className="mt-6 p-4 bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded text-center animate-fade-in">
                  <p className="font-bold text-yellow-300">Sua conexão está péssima!</p>
                  <p className="text-yellow-400">Encontramos uma "solução" que promete otimizar sua rede e acabar com o lag. Deseja baixar?</p>
                  <button 
                    onClick={handleDownload}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg animate-pulse transition-transform transform hover:scale-105"
                  >
                      Baixar "ConnectionBooster.exe" (PERIGOSO)
                  </button>
              </div>
          )}
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-teal-600 dark:text-[#00FFFF] mb-2">Arquitetura de Rede e Fraude</h3>
          <p>Jogos usam diferentes arquiteturas. Em <strong>Cliente-Servidor</strong>, o servidor central valida tudo, o que é mais seguro contra cheats. Em <strong>Peer-to-Peer (P2P)</strong>, os jogadores se conectam diretamente, o que é mais barato para a empresa, mas abre brechas para fraudes e ataques, pois um jogador mal-intencionado pode manipular o jogo ou descobrir seu IP.</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-[#CC0033] mb-3">Vulnerabilidades Críticas (CVEs)</h3>
          <p>Jogos e plataformas populares não estão imunes a falhas graves. Uma <strong>CVE (Common Vulnerabilities and Exposures)</strong> é uma falha de segurança conhecida publicamente. Veja exemplos reais:</p>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            {CVE_DATA.map(cve => <CVECard key={cve.cve} cve={cve} />)}
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Isso mostra que a "superfície de ataque" é enorme, e a confiança que depositamos nessas plataformas pode ser perigosamente explorada.</p>
        </div>
      </div>
    </ModuleContainer>
  );
};

export default Module2;
