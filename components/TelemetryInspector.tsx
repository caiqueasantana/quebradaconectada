import React, { useState, useEffect, useRef } from 'react';

export interface Log {
  timestamp: string;
  event: string;
  data?: object;
}

interface TelemetryInspectorProps {
  logs: Log[];
}

export const TelemetryInspector: React.FC<TelemetryInspectorProps> = ({ logs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const logsEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        if(isOpen) {
            scrollToBottom();
        }
    }, [logs, isOpen]);

    if (!isOpen) {
        return (
             <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 bg-gray-600 dark:bg-gray-700 hover:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-full p-3 shadow-lg z-30 transition-transform hover:scale-110"
                aria-label="Inspecionar telemetria"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M2 3a1 1 0 011-1h14a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm2 4a1 1 0 011-1h10a1 1 0 011 1v1a1 1 0 01-1 1H5a1 1 0 01-1-1V7zm4 4a1 1 0 011-1h2a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1z" clipRule="evenodd" />
                </svg>
            </button>
        )
    }

    return (
        <div className="fixed bottom-4 left-4 w-full max-w-lg h-2/3 bg-black bg-opacity-80 backdrop-blur-sm border-2 border-yellow-500 rounded-lg shadow-2xl z-40 flex flex-col font-mono text-sm animate-fade-in">
            <div className="bg-gray-800 p-2 flex justify-between items-center cursor-move">
                <h3 className="text-yellow-400 font-bold">[INSPETOR DE TELEMETRIA]</h3>
                <button onClick={() => setIsOpen(false)} className="text-white hover:text-red-500 text-2xl" aria-label="Fechar inspetor de telemetria">&times;</button>
            </div>
            <div className="flex-grow p-2 overflow-y-auto text-green-400">
                {logs.length === 0 && <p className="text-gray-500">&gt; Nenhum evento registrado ainda...</p>}
                {[...logs].reverse().map((log, index) => (
                    <div key={index} className="mb-2 whitespace-pre-wrap break-words">
                        <p className="text-yellow-500">{log.timestamp}</p>
                        <p>&gt; Evento: <span className="text-cyan-400">{log.event}</span></p>
                        {log.data && Object.keys(log.data).length > 0 && <p>&gt; Dados: <span className="text-white">{JSON.stringify(log.data)}</span></p>}
                    </div>
                ))}
                <div ref={logsEndRef} />
            </div>
        </div>
    );
};
