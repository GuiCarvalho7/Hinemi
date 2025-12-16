
import { BibleBook, BibleTranslation, SpiritualTrack } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-3-pro-preview';
export const GEMINI_AUDIO_MODEL = 'gemini-2.5-flash-preview-tts';
// Define a default prompt for devotional generation.
export const DEFAULT_DEVOTIONAL_PROMPT = `Gere um devocional diário inspirador e profundo, focado na palavra de Deus. Inclua um versículo chave, uma reflexão que ilumine a mensagem, uma oração sincera e uma ação prática para o dia. A linguagem deve ser envolvente e que toque o coração.`;

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
    icon: `<span class="material-symbols-outlined text-lg">lightbulb</span>`, // Icon is not used directly in new design
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDge4dbHXgmk3CjXL0zuh0ZsPe7vYHY6XL-YNQ3KsIWrPgSrHmH2FF8wT7RD_zCBo-MuJWW3Dwe-ZCkpgGTwXTWtBf0MLMLonr4FECbqP9oQw2WCOFDAuCDOl4pGikNUPEr7vvE11bAUmYJh8GNa6ALZi3Avz3B2XFaUUzasrO-jwdUv0vwzkiH30hwDqB-qIAuq-CuROkzBnnAMtNjiOwEubxeyrHOpTaDNaBJ-ykwjkO3v1Mq1mN64K2nLswN2ac5Ma2Sj15iWas'
  },
  {
    id: 'proposito',
    title: 'Chama Acesa',
    description: 'Descobrindo a vocação divina em sua vida.',
    progress: 0,
    category: 'Propósito',
    daysCount: 21,
    icon: `<span class="material-symbols-outlined text-lg">target</span>`, // Icon is not used directly in new design
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdRaeOAqnq7n8PrnhQPBU70qcC_XvVWpLRD8epVCvqxDEs3_m4ioW5Qjh0ScTGtSUrsmk6HLEdU0Ua3_n42t-_FdssqnFbmy0aNJqFbzurh2RTcCNLDuEr6QHf_DuHZXlrm_Xg3Ph_MY4FupeB4r8LoPD2NbGNsdQt3M2-hAx4OShXm8Y0gdEI3f-5-L77Bm5uy1DgJxqoaNWydWBxqAPUF58YRWEPWFOMhB_0BgUAtey2yAun015KKg_ZQN_hNujXJrJ5ybqGV84'
  },
  {
    id: 'fe',
    title: 'Escudo da Fé',
    description: 'Fortaleça suas defesas espirituais.',
    progress: 0,
    category: 'Fé',
    daysCount: 15,
    icon: `<span class="material-symbols-outlined text-lg">church</span>`, // Icon is not used directly in new design
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4ZWxTy-lMi300Vn_bg1S63u251c8aD4uJnHmUlAt1V0oDRPhqXzHDFSU8GUIec2h9IEE98FcNNMdBEX1E2YW1PVKeccJYBiVGzb3V9xs6PU0PVCY4maEqWm6lOfRWtwYlk3zchvVlYdpK9-doPV-9V6mpRkSnpHUhSC1RBLC_mOjmAviLEDw5Xl3kNaTphwoz3nekvEQusrNB3RtTJytW25YH1hUF4N5yYMXU-j2qsxBPfFzqsubdhfit69omz4WWxAPlGGouIvc'
  },
  {
    id: 'gratidao',
    title: 'Gratidão Radical',
    description: 'O poder transformador de um coração grato.',
    progress: 100,
    category: 'Gratidão',
    daysCount: 7,
    icon: `<span class="material-symbols-outlined text-lg">sentiment_satisfied</span>`, // Icon is not used directly in new design
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3yRAu-ZGbg11zKTboJYqux9k1dJz4H8mK5IT1gr6dHXbAkTiWIQDupuUnjhrzIgWd3x9cm2jFPmHDYB2reKUqrK_EghD_KJbyE5PMK9_exL3kNNhjVd50kDGYboktQ4uaQbaLJ5-kSybUEAQJyIpHL6PFHQBZAS5qcNIDx5R1sVU9Wk3k4X5rWOEGIbI3MlH0GijWtiuHHrDCvlpQW8uv_X87d39yDqW0OcWt8asNlQC89fcD2ZI-BR21VOZsWuS_Tr8LmUNVPG8'
  },
  {
    id: 'amor',
    title: 'O Caminho do Amor',
    description: 'Aprendendo a amar como Cristo amou.',
    progress: 0,
    category: 'Amor',
    daysCount: 14,
    // Add missing 'icon' property
    icon: `<span class="material-symbols-outlined text-lg">favorite</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1517457210-bf26f49c065e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 'perdao',
    title: 'A Graça do Perdão',
    description: 'Experimentando a liberdade de perdoar e ser perdoado.',
    progress: 0,
    category: 'Perdão',
    daysCount: 10,
    // Add missing 'icon' property
    icon: `<span class="material-symbols-outlined text-lg">handshake</span>`,
    imageUrl: 'https://images.unsplash.com/photo-1510972583842-a72049ec608d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];
