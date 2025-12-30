
import React, { useState, useEffect, useRef } from 'react';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS } from '../../constants';
import Button from '../Button';
import { useAppContext } from '../Layout';
import { AppScreen } from '../../types';
import Input from '../Input';

// Gerador de texto mock aprimorado para cobrir todos os livros
const generateMockVerses = (book: string, chapter: number) => {
  const genericVerses = [
    "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.",
    "O Senhor é o meu pastor, nada me faltará.",
    "Tudo posso naquele que me fortalece.",
    "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
    "Buscai primeiro o Reino de Deus e a sua justiça.",
    "O amor é sofredor, é benigno; o amor não é invejoso.",
    "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum.",
    "Lâmpada para os meus pés é tua palavra e luz para o meu caminho.",
    "Elevo os meus olhos para os montes; de onde virá o meu socorro?",
    "Sede fortes e corajosos; não temais, nem vos espanteis diante deles.",
    "O coração alegre serve de bom remédio, mas o espírito abatido seca os ossos.",
    "Ensina-nos a contar os nossos dias, para que alcancemos coração sábio.",
    "Grandes coisas fez o Senhor por nós, por isso estamos alegres.",
    "Fiel é o que vos chama, o qual também o fará.",
    "Para tudo há uma ocasião certa; há um tempo para cada propósito debaixo do céu."
  ];

  // Garante que o texto mude baseado no livro/capítulo mas seja consistente
  const seed = book.length + chapter;
  return Array.from({ length: 15 }, (_, i) => genericVerses[(seed + i) % genericVerses.length]);
};

const fontSizes = {
  sm: 'text-base leading-relaxed',
  md: 'text-lg leading-loose',
  lg: 'text-xl leading-relaxed',
};

const BibleScreen: React.FC = () => {
  const { setActiveScreen } = useAppContext();
  const [selectedBook, setSelectedBook] = useState(BIBLE_BOOKS[0].name);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectedTranslation, setSelectedTranslation] = useState(BIBLE_TRANSLATIONS[0].id);
  const [bibleText, setBibleText] = useState<string[]>([]);
  const [currentFontSize, setCurrentFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [showFontSizeOptions, setShowFontSizeOptions] = useState(false);
  const [isChapterMarked, setIsChapterMarked] = useState<boolean>(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  
  const chaptersInSelectedBook = BIBLE_BOOKS.find(book => book.name === selectedBook)?.chapters || 1;

  useEffect(() => {
    setBibleText(generateMockVerses(selectedBook, selectedChapter));
    setSelectedVerse(null);
  }, [selectedBook, selectedChapter, selectedTranslation]);

  const handleNextChapter = () => {
    if (selectedChapter < chaptersInSelectedBook) setSelectedChapter(prev => prev + 1);
    else {
      const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook);
      if (idx < BIBLE_BOOKS.length - 1) { setSelectedBook(BIBLE_BOOKS[idx + 1].name); setSelectedChapter(1); }
    }
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) setSelectedChapter(prev => prev - 1);
    else {
      const idx = BIBLE_BOOKS.findIndex(b => b.name === selectedBook);
      if (idx > 0) { setSelectedBook(BIBLE_BOOKS[idx - 1].name); setSelectedChapter(BIBLE_BOOKS[idx - 1].chapters); }
    }
  };

  const [showChapterSelection, setShowChapterSelection] = useState(false);

  const handleToggleMarkChapter = () => {
    setIsChapterMarked(!isChapterMarked);
    alert(isChapterMarked ? "Capítulo desmarcado das leituras." : "Capítulo marcado como lido!");
  };

  const handleShareVerse = () => {
    const text = selectedVerse !== null ? bibleText[selectedVerse - 1] : "Bíblia HINEMI";
    alert(`Compartilhando: "${text}"`);
  };

  return (
    <div className="relative flex h-screen w-full flex-col bg-background-dark overflow-hidden animate-fade-in">
      <header className="sticky top-0 z-20 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <button onClick={() => setActiveScreen(AppScreen.Devotional)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-text-muted">arrow_back</span>
        </button>
        <div className="text-center cursor-pointer" onClick={() => setShowChapterSelection(!showChapterSelection)}>
          <h1 className="font-serif text-lg text-text-white uppercase tracking-widest">{selectedBook} {selectedChapter}</h1>
          <p className="text-[10px] text-premium-gold uppercase tracking-tighter">{selectedTranslation}</p>
        </div>
        <button onClick={() => setShowFontSizeOptions(!showFontSizeOptions)} className="size-10 rounded-full hover:bg-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-text-muted">format_size</span>
        </button>
      </header>

      {showChapterSelection && (
        <div className="absolute top-20 left-0 right-0 z-40 bg-surface-dark p-6 border-b border-white/10 shadow-2xl animate-fade-in">
          <select value={selectedBook} onChange={(e) => setSelectedBook(e.target.value)} className="w-full mb-4 bg-background-dark border-white/10 text-text-white rounded-xl">
            {BIBLE_BOOKS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
          <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto">
            {Array.from({ length: chaptersInSelectedBook }, (_, i) => i + 1).map(c => (
              <button key={c} onClick={() => { setSelectedChapter(c); setShowChapterSelection(false); }} className={`p-2 rounded-lg text-xs ${selectedChapter === c ? 'bg-premium-gold text-background-dark' : 'bg-white/5 text-text-white'}`}>{c}</button>
            ))}
          </div>
        </div>
      )}

      <main ref={mainScrollRef} className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        <div className="max-w-xl mx-auto space-y-6">
          <div className={`${fontSizes[currentFontSize]} text-text-muted font-sans`}>
            {bibleText.map((v, i) => (
              <p
                key={i}
                onClick={() => setSelectedVerse(i + 1)}
                className={`mb-4 transition-all duration-300 p-2 rounded-lg cursor-pointer border-l-2 ${selectedVerse === i + 1 ? 'border-premium-gold bg-premium-gold/5 text-text-white' : 'border-transparent'}`}
              >
                <span className="text-xs text-premium-gold mr-3 font-bold">{i + 1}</span>
                {v}
              </p>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center px-6 z-30 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4 bg-surface-dark/90 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl">
          <button onClick={handlePreviousChapter} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-text-muted"><span className="material-symbols-outlined">chevron_left</span></button>
          <button onClick={handleToggleMarkChapter} className={`size-12 rounded-full flex items-center justify-center transition-all ${isChapterMarked ? 'bg-premium-gold text-background-dark' : 'bg-white/5 text-text-white'}`}>
            <span className="material-symbols-outlined icon-filled">{isChapterMarked ? 'check_circle' : 'bookmark'}</span>
          </button>
          <button onClick={handleShareVerse} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-text-muted"><span className="material-symbols-outlined">share</span></button>
          <button onClick={handleNextChapter} className="size-10 rounded-full hover:bg-white/10 flex items-center justify-center text-text-muted"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
    </div>
  );
};

export default BibleScreen;
