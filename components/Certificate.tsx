import React, { useState } from 'react';

interface CertificateProps {
  name: string;
  onBack: () => void;
  logEvent: (event: string, data?: object) => void;
}

declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

const Certificate: React.FC<CertificateProps> = ({ name, onBack, logEvent }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [verificationId] = useState(
      `QC-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase()
  );

  const handleDownloadPdf = () => {
    const certificateElement = document.getElementById('certificate');
    if (!certificateElement) return;

    setIsGenerating(true);
    logEvent('certificate_download_start');
    
    // Temporarily set background for canvas capture in light mode
    const isDarkMode = document.documentElement.classList.contains('dark');
    const originalBackgroundColor = certificateElement.style.backgroundColor;
    if (!isDarkMode) {
      certificateElement.style.backgroundColor = '#ffffff';
    }


    window.html2canvas(certificateElement, {
      useCORS: true,
      scale: 2.5,
       backgroundColor: isDarkMode ? '#0c142b' : '#ffffff',
    }).then(canvas => {
       if (!isDarkMode) {
          certificateElement.style.backgroundColor = originalBackgroundColor;
       }

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Certificado-Autonomia-Digital-${name.trim().replace(/\s+/g, '_')}.pdf`);
      logEvent('certificate_download_success');
    }).catch(err => {
        logEvent('certificate_download_error', { error: err.message });
    }).finally(() => {
      setIsGenerating(false);
    });
  };

  return (
    <div className="flex flex-col items-center animate-fade-in">
      <div id="certificate" className="bg-white dark:bg-[#0c142b] border-4 border-double border-yellow-500 dark:border-[#FFD700] p-8 md:p-12 w-full max-w-4xl text-center relative printable-area overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffd700'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm-9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: 'auto' }}></div>
        
        <div className="relative z-10">
          <p className="text-2xl text-gray-700 dark:text-gray-300 tracking-wider">Certificado de Conclusão</p>
          <h1 className="text-4xl md:text-5xl font-bold text-purple-700 dark:text-[#FFD700] my-4 uppercase tracking-widest" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
            Autonomia Digital
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mt-8">Este certificado é concedido a</p>
          <p className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white my-6 border-b-2 border-yellow-500 dark:border-[#FFD700] pb-2 inline-block">
            {name}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            por concluir com sucesso a jornada de aprendizado "Quebrada Conectada", demonstrando compromisso com a literacia crítica, segurança e a luta por um ambiente digital mais justo e transparente.
          </p>
          <div className="mt-12 flex justify-between items-end">
            <div className="text-left">
              <p className="text-lg text-gray-700 dark:text-gray-300 border-t-2 border-gray-400 dark:border-gray-600 pt-1">Fatec Carapicuíba</p>
              <p className="text-sm text-gray-500">Projeto de Pesquisa</p>
            </div>
            <div className="text-center font-mono text-xs text-gray-500">
                <p>ID de Verificação:</p>
                <p>{verificationId}</p>
            </div>
            <div className="text-right">
              <p className="text-lg text-gray-700 dark:text-gray-300 border-t-2 border-gray-400 dark:border-gray-600 pt-1">{new Date().toLocaleDateString('pt-BR')}</p>
              <p className="text-sm text-gray-500">Data de Emissão</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex space-x-4 no-print">
        <button
          onClick={onBack}
          className="bg-gray-600 dark:bg-gray-700 hover:bg-red-600 dark:hover:bg-[#CC0033] text-white font-bold py-2 px-6 rounded-lg transition-colors"
        >
          ← Voltar ao Menu
        </button>
        <button
          onClick={handleDownloadPdf}
          disabled={isGenerating}
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:bg-gray-500 disabled:cursor-wait"
        >
          {isGenerating ? 'Gerando PDF...' : 'Baixar Certificado (PDF)'}
        </button>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-area, .printable-area * {
            visibility: visible;
          }
          .printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none !important;
          }
          html.dark .printable-area {
            background-color: #0c142b;
            color: white;
          }
           html:not(.dark) .printable-area {
            background-color: #ffffff;
            color: black;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Certificate;
