import React, { useState, useMemo, useCallback } from 'react';
import ModuleContainer from '../shared/ModuleContainer';

interface Module4Props {
    onBack: () => void;
    logEvent: (event: string, data?: object) => void;
}

const GUIDE_ITEMS = [
  {
    id: 'mfa',
    title: 'Fortaleça suas Contas: MFA e Gerenciadores de Senha',
    content: (
      <>
        <p><strong>Autenticação de Múltiplos Fatores (MFA):</strong> Ative em todas as suas contas (Steam, Discord, etc.). É uma camada extra de segurança que exige um código do seu celular para fazer login. Isso impede que alguém acesse sua conta mesmo que roube sua senha.</p>
        <p><strong>Gerenciadores de Senha:</strong> Ferramentas como Bitwarden (gratuito) ou 1Password criam e armazenam senhas fortes e únicas para cada site. Você só precisa lembrar de uma senha mestre.</p>
      </>
    ),
  },
  {
    id: 'vpn',
    title: 'Proteja sua Conexão: VPNs',
    content: (
      <>
        <p><strong>VPN (Rede Privada Virtual):</strong> Uma VPN esconde seu endereço de IP real e criptografa sua conexão. Isso te protege de riscos graves como:</p>
        <ul className="list-disc list-inside ml-4">
          <li><strong>Doxxing:</strong> Exposição pública de suas informações pessoais (nome, endereço) a partir do seu IP.</li>
          <li><strong>Swatting:</strong> Um trote perigoso para a polícia, enviando uma equipe da SWAT para sua casa.</li>
          <li>Ataques de negação de serviço (DDoS) direcionados à sua rede.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'community',
    title: 'A Força da Comunidade: Organização e Apoio Mútuo',
    content: (
      <>
        <p>A maior estratégia da quebrada é a união. Converse com seus amigos sobre segurança digital. Crie grupos no Discord ou WhatsApp para discutir sobre os riscos, compartilhar dicas e criticar as plataformas que abusam dos seus dados.</p>
        <p>Apoio mútuo já é parte da nossa cultura. Vamos levar isso para o mundo digital. Ao nos organizarmos, podemos exigir mais transparência e respeito das empresas de jogos.</p>
      </>
    ),
  },
];

const PasswordStrengthChecker: React.FC<{ logEvent: (event: string, data?: object) => void }> = ({ logEvent }) => {
    const [password, setPassword] = useState('');

    const strength = useMemo(() => {
        let score = 0;
        const suggestions = [];

        if (password.length < 1) return { score: -1, suggestions: [], width: 0, color: '', label: ''};

        if (password.length >= 8) score++; else suggestions.push('Pelo menos 8 caracteres.');
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++; else suggestions.push('Use letras maiúsculas e minúsculas.');
        if (/\d/.test(password)) score++; else suggestions.push('Inclua números.');
        if (/[^a-zA-Z0-9]/.test(password)) score++; else suggestions.push('Inclua símbolos (ex: !@#$).');

        const width = (score / 4) * 100;
        let color = 'bg-red-600';
        let label = 'Muito Fraca';
        if (score >= 4) { color = 'bg-green-600'; label = 'Muito Forte'; } 
        else if (score === 3) { color = 'bg-yellow-500'; label = 'Forte'; } 
        else if (score === 2) { color = 'bg-orange-500'; label = 'Média'; }

        return { score, suggestions, width, color, label };

    }, [password]);
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        logEvent('password_strength_test', { length: newPassword.length, score: strength.score });
    }

    return (
        <div className="mt-8 bg-gray-200 dark:bg-gray-800 p-6 rounded-lg border-2 border-purple-400 dark:border-[#6A0DAD]">
            <h4 className="text-xl font-bold text-purple-700 dark:text-[#FFD700]">Teste Prático: Verificador de Força de Senha</h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">Digite uma senha abaixo para ver sua força em tempo real.</p>
            <input
                type="text"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Digite uma senha para testar"
                className="w-full bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-600 focus:border-purple-500 dark:focus:border-[#FFD700] text-gray-800 dark:text-white text-lg p-3 rounded-lg focus:outline-none transition-colors"
                aria-label="Verificador de senha"
            />
            {password && strength.score >= 0 && (
                 <div className="mt-4">
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4">
                        <div className={`h-4 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.width}%` }}></div>
                    </div>
                    <p className="text-center font-bold mt-2" style={{ color: strength.color.replace('bg-', '').replace('-600', '-400').replace('-500', '-300') }}>{strength.label}</p>
                    {strength.suggestions.length > 0 && strength.score < 4 && (
                        <div className="mt-3 text-sm text-yellow-700 dark:text-yellow-300">
                            <p className="font-semibold">Sugestões para melhorar:</p>
                            <ul className="list-disc list-inside ml-4">
                                {strength.suggestions.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </div>
                    )}
                 </div>
            )}
        </div>
    );
};


const GuideItem: React.FC<{ title: string; isChecked: boolean; onToggle: () => void; children: React.ReactNode; }> = ({ title, isChecked, onToggle, children }) => (
  <div className={`bg-gray-100 dark:bg-gray-800 dark:bg-opacity-60 p-6 rounded-lg border-l-4 ${isChecked ? 'border-green-500' : 'border-green-800 dark:border-[#008000]'} transition-colors duration-300`}>
    <label className="flex items-start cursor-pointer">
      <div className="flex-shrink-0 mt-1">
        <input 
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          className="form-checkbox h-6 w-6 text-green-500 bg-gray-300 dark:bg-gray-700 border-gray-600 rounded focus:ring-green-500"
        />
      </div>
      <div className="ml-4">
        <h4 className={`text-xl font-bold ${isChecked ? 'text-green-600 dark:text-green-400' : 'text-teal-700 dark:text-[#00FFFF]'}`}>{title}</h4>
        <div className="text-gray-700 dark:text-gray-300 space-y-2 mt-2">{children}</div>
      </div>
    </label>
  </div>
);


const Module4: React.FC<Module4Props> = ({ onBack, logEvent }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleToggle = (id: string) => {
    const newState = !checkedItems[id];
    setCheckedItems(prev => ({ ...prev, [id]: newState }));
    logEvent('guide_item_toggled', { item: id, checked: newState });
  };

  const progress = useMemo(() => {
    const totalItems = GUIDE_ITEMS.length;
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  }, [checkedItems]);

  return (
    <ModuleContainer title="Módulo 4: Autonomia Digital e Estratégias da Quebrada" onBack={onBack}>
      <p className="text-lg mb-4">
        Estar ciente dos riscos é o primeiro passo. O segundo é agir. A autonomia digital não é sobre se desconectar, mas sobre usar a tecnologia de forma mais segura e consciente. Marque os itens abaixo para completar seu guia de sobrevivência.
      </p>
      
      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 mb-6">
        <div className="bg-gradient-to-r from-teal-500 to-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="space-y-6">
        {GUIDE_ITEMS.map(item => (
          <GuideItem 
            key={item.id}
            title={item.title}
            isChecked={!!checkedItems[item.id]}
            onToggle={() => handleToggle(item.id)}
          >
            {item.content}
          </GuideItem>
        ))}
      </div>

      <PasswordStrengthChecker logEvent={logEvent} />

    </ModuleContainer>
  );
};

export default Module4;
