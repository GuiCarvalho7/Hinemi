
import { BibleBook, BibleTranslation, SpiritualTrack, DevotionalContent } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-3-pro-preview';
export const GEMINI_AUDIO_MODEL = 'gemini-2.5-flash-preview-tts';

export const DEFAULT_DEVOTIONAL_PROMPT = `Gere um devocional diário inspirador e profundo, focado na palavra de Deus. Inclua um versículo chave, uma reflexão que ilumine a mensagem, uma oração sincera e uma ação prática para o dia. A linguagem deve ser envolvente e que toque o coração.`;

// Conteúdo de exemplo para quando a IA não estiver disponível ou for o primeiro acesso
export const MOCK_DEVOTIONAL: DevotionalContent = {
  verse: "Filipenses 4:13",
  reflection: "A força que Paulo descreve aqui não é uma capacidade física ou mental própria, mas uma infusão divina. Em meio às tempestades, somos sustentados por uma mão invisível que nos capacita a ir além dos nossos limites. Hoje, lembre-se que sua resiliência não vem de você, mas dAquele que te chamou.",
  prayer: "Senhor, obrigado por ser minha rocha. Quando eu me sentir fraco, que eu possa descansar na Tua força que me impulsiona. Amém.",
  action: "Identifique um desafio que você tem evitado e dê o primeiro passo hoje, confiando na capacitação divina."
};

export const BIBLE_BOOKS: BibleBook[] = [
  { name: 'Gênesis', chapters: 50 },
  { name: 'Êxodo', chapters: 40 },
  { name: 'Levítico', chapters: 27 },
  { name: 'Números', chapters: 36 },
  { name: 'Deuteronômio', chapters: 34 },
  { name: 'Josué', chapters: 24 },
  { name: 'Juízes', chapters: 21 },
  { name: 'Rute', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Reis', chapters: 22 },
  { name: '2 Reis', chapters: 25 },
  { name: '1 Crônicas', chapters: 29 },
  { name: '2 Crônicas', chapters: 36 },
  { name: 'Esdras', chapters: 10 },
  { name: 'Neemias', chapters: 13 },
  { name: 'Ester', chapters: 10 },
  { name: 'Jó', chapters: 42 },
  { name: 'Salmos', chapters: 150 },
  { name: 'Provérbios', chapters: 31 },
  { name: 'Eclesiastes', chapters: 12 },
  { name: 'Cantares', chapters: 8 },
  { name: 'Isaías', chapters: 66 },
  { name: 'Jeremias', chapters: 52 },
  { name: 'Lamentações', chapters: 5 },
  { name: 'Ezequiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Oséias', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amós', chapters: 9 },
  { name: 'Obadias', chapters: 1 },
  { name: 'Jonas', chapters: 4 },
  { name: 'Miquéias', chapters: 7 },
  { name: 'Naum', chapters: 3 },
  { name: 'Habacuque', chapters: 3 },
  { name: 'Sofonias', chapters: 3 },
  { name: 'Ageu', chapters: 2 },
  { name: 'Zacarias', chapters: 14 },
  { name: 'Malaquias', chapters: 4 },
  { name: 'Mateus', chapters: 28 },
  { name: 'Marcos', chapters: 16 },
  { name: 'Lucas', chapters: 24 },
  { name: 'João', chapters: 21 },
  { name: 'Atos', chapters: 28 },
  { name: 'Romanos', chapters: 16 },
  { name: '1 Coríntios', chapters: 16 },
  { name: '2 Coríntios', chapters: 13 },
  { name: 'Gálatas', chapters: 6 },
  { name: 'Efésios', chapters: 6 },
  { name: 'Filipenses', chapters: 4 },
  { name: 'Colossenses', chapters: 4 },
  { name: '1 Tessalonicenses', chapters: 5 },
  { name: '2 Tessalonicenses', chapters: 3 },
  { name: '1 Timóteo', chapters: 6 },
  { name: '2 Timóteo', chapters: 4 },
  { name: 'Tito', chapters: 3 },
  { name: 'Filemom', chapters: 1 },
  { name: 'Hebreus', chapters: 13 },
  { name: 'Tiago', chapters: 5 },
  { name: '1 Pedro', chapters: 5 },
  { name: '2 Pedro', chapters: 3 },
  { name: '1 João', chapters: 5 },
  { name: '2 João', chapters: 1 },
  { name: '3 João', chapters: 1 },
  { name: 'Judas', chapters: 1 },
  { name: 'Apocalipse', chapters: 22 },
];

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  { id: 'ARA', name: 'Almeida Revista e Atualizada' },
  { id: 'ACF', name: 'Almeida Corrigida Fiel' },
  { id: 'NVI', name: 'Nova Versão Internacional' },
  { id: 'NVT', name: 'Nova Versão Transformadora' },
  { id: 'ARC', name: 'Almeida Revista e Corrigida' },
  { id: 'NAA', name: 'Nova Almeida Atualizada' },
];

export const SPIRITUAL_TRACKS: SpiritualTrack[] = [
  {
    id: 'ansiedade',
    title: 'Paz de Aço',
    description: 'A serenidade de Cristo em momentos de caos.',
    progress: 40,
    category: 'Ansiedade',
    daysCount: 30,
    icon: `<span class="material-symbols-outlined">psychology</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dac3adaf471?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 'proposito',
    title: 'Chama Acesa',
    description: 'Descobrindo a vocação divina em sua vida.',
    progress: 0,
    category: 'Propósito',
    daysCount: 21,
    icon: `<span class="material-symbols-outlined">local_fire_department</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 'fe',
    title: 'Escudo da Fé',
    description: 'Fortaleça suas defesas espirituais.',
    progress: 0,
    category: 'Fé',
    daysCount: 15,
    icon: `<span class="material-symbols-outlined">shield</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: 'gratidao',
    title: 'Gratidão Radical',
    description: 'O poder transformador de um coração grato.',
    progress: 100,
    category: 'Gratidão',
    daysCount: 7,
    icon: `<span class="material-symbols-outlined">favorite</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2940&auto=format&fit=crop'
  }
];
