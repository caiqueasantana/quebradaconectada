
import type { Module } from './types';

export const THEME_COLORS = {
  vigilance: {
    main: '#050F2C',
    accent: '#CC0033',
    text: 'text-[#CC0033]',
    border: 'border-[#CC0033]',
  },
  literacy: {
    main: '#00FFFF',
    accent: '#008000',
    text: 'text-[#00FFFF]',
    border: 'border-[#00FFFF]',
  },
  ludicity: {
    main: '#FFD700',
    accent: '#6A0DAD',
    text: 'text-[#FFD700]',
    border: 'border-[#FFD700]',
  },
};

export const MODULES: Module[] = [
  {
    id: 1,
    title: 'Módulo 1: O Lazer que Vira Labuta',
    subtitle: 'O Excedente Comportamental',
    description: 'Descubra como seu clique no jogo se transforma em valor para grandes corporações, numa simulação do Capitalismo de Vigilância.',
    theme: 'vigilance',
  },
  {
    id: 2,
    title: 'Módulo 2: Infraestrutura da Vulnerabilidade',
    subtitle: 'O Desafio da Quebrada',
    description: 'Entenda como a infraestrutura de rede precária te expõe a riscos de segurança e vulnerabilidades conhecidas (CVEs).',
    theme: 'vigilance',
  },
  {
    id: 3,
    title: 'Módulo 3: O Olhar Crítico da LGPD',
    subtitle: 'O Dilema Intrínseco',
    description: 'Teste seu entendimento sobre consentimento de dados e veja o conflito entre privacidade e os sistemas anti-cheat.',
    theme: 'literacy',
  },
  {
    id: 4,
    title: 'Módulo 4: Autonomia Digital',
    subtitle: 'Estratégias da Quebrada',
    description: 'Aprenda estratégias práticas para se proteger online, desde MFA e VPNs até a organização comunitária.',
    theme: 'literacy',
  },
];
