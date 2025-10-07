import React, { useState, useEffect } from 'react';
import ModuleContainer from '../shared/ModuleContainer';

interface Module3Props {
    onBack: () => void;
    logEvent: (event: string, data?: object) => void;
}

// --- SUBCOMPONENTS ---

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
    <span className="relative group inline-block">
        <span 
            className="text-yellow-500 dark:text-yellow-400 underline decoration-dotted cursor-help focus:outline-none focus:ring-2 focus:ring-yellow-500 rounded"
            tabIndex={0}
            role="button"
            aria-describedby="tooltip-text"
        >
            {children}
        </span>
        <div 
            id="tooltip-text"
            role="tooltip"
            className="absolute bottom-full mb-3 w-72 bg-gray-900 dark:bg-black text-white text-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 z-10 pointer-events-none transform -translate-x-1/2 left-1/2 shadow-lg"
        >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-900 dark:border-t-black"></div>
        </div>
    </span>
);

const ConsentPopup: React.FC<{ onAccept: () => void }> = ({ onAccept }) => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#050F2C] border-2 border-gray-300 dark:border-gray-600 rounded-lg max-w-2xl w-full p-6 animate-fade-in flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Para continuar, aceite nossos Termos!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Atualizamos nossas políticas para melhorar sua experiência.</p>
            
            <div className="h-24 overflow-y-scroll p-3 bg-gray-100 dark:bg-black dark:bg-opacity-50 border border-gray-300 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400 space-y-2 leading-tight">
                <p>Ao aceitar, você concorda que o software anti-cheat "Guardian Shield" opere em <Tooltip text="O nível mais profundo do seu sistema operacional. O anti-cheat terá o mesmo poder que o próprio Windows/Linux, podendo ver e fazer TUDO.">nível de kernel (Ring 0)</Tooltip>, monitorando continuamente todos os processos, arquivos e tráfego de rede, mesmo quando o jogo não está em execução. Adicionalmente, coletamos <Tooltip text="Dados sobre como você joga, o que você clica, por quanto tempo joga, seu hardware, etc. Tudo que você faz no jogo.">dados de telemetria</Tooltip>, incluindo, mas não se limitando a: especificações de hardware, softwares instalados, padrões de uso, e identificadores únicos de dispositivo. Estes dados podem ser compartilhados com nossos <Tooltip text="Empresas de publicidade como Google e Facebook, que usam seus dados para te mostrar anúncios direcionados dentro e fora do jogo.">parceiros de publicidade e análise</Tooltip> para personalizar sua experiência e para fins de marketing. O tratamento destes dados é essencial para a funcionalidade do serviço e sua continuidade implica na aceitação da <Tooltip text="Significa que eles podem coletar o que quiserem, sem especificar limites. É um cheque em branco para o uso dos seus dados.">coleta e tratamento irrestrito</Tooltip> dos seus dados conforme descrito, renunciando a contestações futuras sobre a necessidade de tal monitoramento para a integridade do ambiente de jogo. Você também concorda em receber comunicações de marketing por email e notificações push.</p>
            </div>
            
             <label className="flex items-center mt-4 text-xs text-gray-500">
                <input type="checkbox" defaultChecked className="form-checkbox h-3 w-3 text-teal-600 bg-gray-200 border-gray-400" />
                <span className="ml-2">Sim, eu li e concordo com os termos de serviço.</span>
            </label>

            <div className="mt-4 flex flex-col items-center">
                <button 
                    onClick={onAccept}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 px-10 rounded-lg transition-transform transform hover:scale-105 animate-pulse"
                >
                    Aceitar e Jogar Agora!
                </button>
                <button disabled className="mt-2 text-xs text-gray-400 dark:text-gray-600 cursor-not-allowed">Recusar (desabilita o acesso ao jogo)</button>
            </div>
        </div>
    </div>
);

const DataFlowAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(onComplete, 4000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const FlowLine: React.FC<{ delay: string }> = ({ delay }) => (
        <svg className="absolute w-full h-full top-0 left-0 overflow-visible">
            <path className="flow-path" d="M 50,100 C 50,200 250,200 250,300" stroke="url(#flow-gradient)" strokeWidth="3" fill="none" style={{ animationDelay: delay }} />
        </svg>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4 font-mono">Processando consentimento...</h2>
            <p className="text-gray-400 mb-8">Seus dados estão sendo sincronizados com nossos parceiros.</p>
            <div className="flex justify-around w-full max-w-4xl items-center">
                <div className="flex flex-col items-center text-center">
                     <div className="text-5xl mb-2">👤</div>
                    <p className="font-bold text-white">Você</p>
                </div>
                <div className="relative mx-8 flex-grow h-1">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600"></div>
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-red-500 animate-flow"></div>
                     <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-purple-500 animate-flow animation-delay-500"></div>
                </div>
                <div className="flex space-x-8">
                     <div className="flex flex-col items-center text-center animate-fade-in animation-delay-1000">
                        <div className="text-5xl mb-2">🏢</div>
                        <p className="font-bold text-white">Game Corp.</p>
                    </div>
                     <div className="flex flex-col items-center text-center animate-fade-in animation-delay-1500">
                        <div className="text-5xl mb-2">📢</div>
                        <p className="font-bold text-white">Ad Tech</p>
                    </div>
                     <div className="flex flex-col items-center text-center animate-fade-in animation-delay-2000">
                        <div className="text-5xl mb-2">📈</div>
                        <p className="font-bold text-white">Data Brokers</p>
                    </div>
                </div>
            </div>
             <style>{`
                @keyframes flow { 
                    0% { transform: scaleX(0); transform-origin: left; }
                    50% { transform: scaleX(1); transform-origin: left; }
                    51% { transform: scaleX(1); transform-origin: right; }
                    100% { transform: scaleX(0); transform-origin: right; }
                }
                .animate-flow { animation: flow 2s ease-in-out infinite; }
                .animation-delay-500 { animation-delay: 0.5s; }
                .animation-delay-1000 { animation-delay: 1s; }
                .animation-delay-1500 { animation-delay: 1.5s; }
                .animation-delay-2000 { animation-delay: 2s; }
            `}</style>
        </div>
    );
};


const RealityCheck: React.FC<{ logEvent: (event: string, data?: object) => void }> = ({ logEvent }) => {
    const questions = [
        {
            id: 'q1',
            text: 'Você deu permissão para o jogo monitorar TUDO em seu PC, com acesso total ao sistema (nível de kernel)?',
            reason: 'O termo <strong class="text-yellow-400">"nível de kernel (Ring 0)"</strong> significa exatamente isso. É uma permissão de acesso irrestrito, justificada para fins de anti-cheat.'
        },
        {
            id: 'q2',
            text: 'Você concordou que seus dados de jogo (o que faz, quando joga, etc.) podem ser vendidos a empresas de publicidade?',
            reason: 'Sim. A cláusula <strong class="text-yellow-400">"compartilhados com nossos parceiros de publicidade e análise"</strong> autoriza a venda e o uso dos seus dados para marketing.'
        },
        {
            id: 'q3',
            text: 'O jogo pode monitorar seus arquivos e sua rede mesmo quando você NÃO está jogando?',
            reason: 'Sim. A frase <strong class="text-yellow-400">"monitorando continuamente [...] mesmo quando o jogo não está em execução"</strong> concede essa permissão invasiva.'
        }
    ];

    const [answers, setAnswers] = useState<Record<string, boolean>>({});

    const handleAnswer = (id: string) => {
        setAnswers(prev => ({...prev, [id]: true}));
        logEvent('reality_check_answered', { questionId: id });
    };

    return (
        <div className="mt-8 p-6 bg-gray-900 bg-opacity-70 dark:bg-gray-800 rounded-lg border-2 border-teal-500 dark:border-[#00FFFF]">
            <h3 className="text-2xl font-bold text-teal-500 dark:text-[#00FFFF] mb-4">Cheque de Realidade: O Que Você Aceitou?</h3>
            <div className="space-y-4">
                {questions.map(q => (
                    <div key={q.id} className="bg-gray-800 dark:bg-black dark:bg-opacity-40 p-4 rounded">
                        <p className="font-semibold mb-3">{q.text}</p>
                        {!answers[q.id] ? (
                            <button onClick={() => handleAnswer(q.id)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                Revelar Resposta
                            </button>
                        ) : (
                            <div className="p-3 bg-red-900 bg-opacity-50 border border-red-500 rounded animate-fade-in">
                                <p className="font-bold text-red-400">A resposta é: SIM, você concordou.</p>
                                <p className="text-sm text-gray-300 mt-2" dangerouslySetInnerHTML={{ __html: q.reason }} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const Module3: React.FC<Module3Props> = ({ onBack, logEvent }) => {
    const [accepted, setAccepted] = useState(false);
    const [showPopup, setShowPopup] = useState(true);
    const [showAnimation, setShowAnimation] = useState(false);

    const handleAccept = () => {
        setShowPopup(false);
        setShowAnimation(true);
        logEvent('terms_accepted_dark_pattern');
    };
    
    const handleAnimationComplete = () => {
        setShowAnimation(false);
        setAccepted(true);
    }

    return (
        <ModuleContainer title="Módulo 3: O Olhar Crítico da LGPD" onBack={onBack}>
            {showPopup && <ConsentPopup onAccept={handleAccept} />}
            {showAnimation && <DataFlowAnimation onComplete={handleAnimationComplete} />}
            
            <p className="text-lg mb-6">
                A <strong>LGPD (Lei Geral de Proteção de Dados)</strong> existe para proteger você. Ela diz que o consentimento para uso de dados deve ser livre, informado e inequívoco. Mas será que é isso que acontece nos jogos?
            </p>
            
            {accepted ? (
                 <RealityCheck logEvent={logEvent} />
            ) : (
                <div className="text-center text-gray-500 p-8 bg-gray-800 rounded-lg">
                    <p className="font-bold text-xl">Aguardando sua decisão...</p>
                    <p>Você precisa aceitar os termos para prosseguir com a análise.</p>
                </div>
            )}
            
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-teal-600 dark:text-[#00FFFF] mb-2">Decodificando o Consentimento</h3>
                <p>Você acabou de experienciar os <strong>"dark patterns"</strong> (padrões sombrios): designs de interface feitos para te enganar e te levar a tomar decisões contra seus próprios interesses. Botões de aceite grandes e coloridos, textos jurídicos minúsculos, opções de recusa escondidas — tudo isso é engenharia social. A LGPD exige consentimento claro, mas na prática, recebemos um pacote "tudo ou nada". Ou você aceita a vigilância total, ou não joga. Esse é o dilema ético-legal que enfrentamos.</p>
            </div>
        </ModuleContainer>
    );
};

export default Module3;
