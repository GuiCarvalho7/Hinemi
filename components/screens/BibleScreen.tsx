
import React, { useState, useEffect, useRef } from 'react';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS } from '../../constants';
import Button from '../Button';
import { useAppContext } from '../Layout';
import { AppScreen } from '../../types';
import Input from '../Input';

// Mock Bible content for demonstration
const mockBibleContent = (book: string, chapter: number, translation: string) => {
  const contentMap: { [key: string]: string[] } = {
    'João 3:16 ARA': [`No princípio Deus criou os céus e a terra.`, `A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas.`, `Disse Deus: "Haja luz", e houve luz.`, `Deus viu que a luz era boa, e separou a luz das trevas.`, `Deus chamou à luz dia, e às trevas chamou noite. Passaram-se a tarde e a manhã; esse foi o primeiro dia.`],
    'João 3:16 NVI': [`No princípio Deus criou os céus e a terra.`, `Era a terra sem forma e vazia; trevas cobriam a face do abismo, e o Espírito de Deus se movia sobre a face das águas.`, `Disse Deus: "Haja luz", e houve luz.`, `Deus viu que a luz era boa, e separou a luz das trevas.`, `Deus chamou à luz dia, e às trevas chamou noite. Passaram-se a tarde e a manhã; esse foi o primeiro dia.`],
    'João 3:17 ARA': [`Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.`, `Mas sim para que, através dele, todos pudessem ser reconciliados consigo.`, `Sua missão não foi de julgamento, mas de redenção e amor eterno.`],
    'Gênesis 1:1 ARA': [
      `No princípio Deus criou os céus e a terra.`,
      `A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas.`,
      `Disse Deus: "Haja luz", e houve luz.`,
      `Deus viu que a luz era boa, e separou a luz das trevas.`,
      `Deus chamou à luz dia, e às trevas chamou noite. Passaram-se a tarde e a manhã; esse foi o primeiro dia.`,
      `Depois disse Deus: "Haja entre as águas um firmamento que separe águas de águas".`,
      `Então Deus fez o firmamento e separou as águas que estavam embaixo do firmamento das que estavam por cima. E assim foi.`,
      `Ao firmamento Deus chamou céu. Passaram-se a tarde e a manhã; esse foi o segundo dia.`,
      `E disse Deus: "Ajuntem-se num só lugar as águas que estão debaixo do céu, e apareça a parte seca". E assim foi.`,
      `E Deus chamou à parte seca Terra, e ao ajuntamento das águas chamou Mares. E viu Deus que era bom.`,
      `E disse Deus: "Produza a terra relva, erva que dê semente e árvores frutíferas que deem fruto segundo a sua espécie, cuja semente esteja nele, sobre a terra". E assim foi.`,
      `A terra produziu relva, erva que dê semente segundo a sua espécie, e árvores que deem fruto, cuja semente esteja nele, segundo a sua espécie. E viu Deus que era bom.`,
      `Passaram-se a tarde e a manhã; esse foi o terceiro dia.`,
      `E disse Deus: "Haja luminares no firmamento do céu para separar o dia da noite e sirvam eles de sinais para as estações, para os dias e para os anos,`,
      `e sirvam de luminares no firmamento do céu para iluminar a terra". E assim foi.`,
      `Deus fez os dois grandes luminares: o maior para governar o dia e o menor para governar a noite; fez também as estrelas.`,
      `Deus os colocou no firmamento do céu para iluminar a terra,`,
      `governar o dia e a noite, e separar a luz das trevas. E viu Deus que era bom.`,
      `Passaram-se a tarde e a manhã; esse foi o quarto dia.`,
      `E disse Deus: "Pululem as águas de seres viventes, e voem aves sobre a terra no vasto firmamento do céu".`,
      `Criou, pois, Deus os grandes monstros marinhos e todos os seres vivos que se movem, com os quais as águas pulularam, segundo as suas espécies, e todas as aves, segundo as suas espécies. E viu Deus que era bom.`,
      `E Deus os abençoou, dizendo: "Frutificai e multiplicai-vos e enchei as águas nos mares; e as aves se multipliquem na terra".`,
      `Passaram-se a tarde e a manhã; esse foi o quinto dia.`,
      `E disse Deus: "Produza a terra seres viventes segundo a sua espécie: animais domésticos, répteis e animais selvagens, segundo a sua espécie". E assim foi.`,
      `Deus fez os animais selvagens segundo a sua espécie, os animais domésticos segundo a sua espécie, e todos os répteis da terra segundo a sua espécie. E viu Deus que era bom.`,
      `Então disse Deus: "Façamos o homem à nossa imagem, conforme a nossa semelhança; domine ele sobre os peixes do mar, sobre as aves do céu, sobre os animais grandes de toda a terra e sobre todos os pequenos animais que se movem rente ao chão".`,
      `Criou Deus o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.`,
      `E Deus os abençoou e lhes disse: "Sede férteis e multiplicai-vos! Enchei e subjugai a terra. Dominai sobre os peixes do mar, sobre as aves do céu e sobre todos os animais que rastejam pela terra!"`,
      `Disse Deus: "Eis que vos dou todas as plantas que dão semente e que estão em toda a terra, e todas as árvores que têm fruto que dê semente; ser-vos-ão para alimento.`,
      `E a todo animal da terra, e a toda ave do céu, e a todo ser que rasteja sobre a terra, em que há fôlego de vida, dou toda a erva verde para alimento". E assim foi.`,
      `E viu Deus tudo quanto fizera, e eis que era muito bom. Passaram-se a tarde e a manhã; esse foi o sexto dia.`,
    ],
  };
  // Simplified mock: return the content array for Genesis 1:1 if available, otherwise a generic array
  return contentMap[`${book} ${chapter}:1 ${translation}`] || contentMap[`Gênesis 1:1 ARA`] || [];
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
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null); // New state for selected verse
  const mainScrollRef = useRef<HTMLDivElement>(null);

  // Search states
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const chaptersInSelectedBook = BIBLE_BOOKS.find(book => book.name === selectedBook)?.chapters || 1;

  const handleFetchBibleText = () => {
    const content = mockBibleContent(selectedBook, selectedChapter, selectedTranslation);
    setBibleText(content);
    // Load marked status from localStorage
    const markedChapters = JSON.parse(localStorage.getItem('markedChapters') || '{}');
    setIsChapterMarked(!!markedChapters[`${selectedBook}-${selectedChapter}-${selectedTranslation}`]);
    setSelectedVerse(null); // Reset selected verse on chapter change
  };

  const handleNextChapter = () => {
    if (selectedChapter < chaptersInSelectedBook) {
      setSelectedChapter(prev => prev + 1);
    } else {
      const currentBookIndex = BIBLE_BOOKS.findIndex(book => book.name === selectedBook);
      if (currentBookIndex < BIBLE_BOOKS.length - 1) {
        setSelectedBook(BIBLE_BOOKS[currentBookIndex + 1].name);
        setSelectedChapter(1);
      } else {
        alert('Você chegou ao final da Bíblia (mock)!');
      }
    }
  };

  const handlePreviousChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(prev => prev - 1);
    } else {
      const currentBookIndex = BIBLE_BOOKS.findIndex(book => book.name === selectedBook);
      if (currentBookIndex > 0) {
        const previousBook = BIBLE_BOOKS[currentBookIndex - 1];
        setSelectedBook(previousBook.name);
        setSelectedChapter(previousBook.chapters);
      } else {
        alert('Você chegou ao início da Bíblia (mock)!');
      }
    }
  };

  useEffect(() => {
    handleFetchBibleText();
  }, [selectedBook, selectedChapter, selectedTranslation]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Scroll to top when chapter changes
    if (mainScrollRef.current) {
        mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedBook, selectedChapter]);

  const [showChapterSelection, setShowChapterSelection] = useState(false);
  const [showTranslationSelection, setShowTranslationSelection] = useState(false);

  const performSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const term = searchTerm.toLowerCase();
    const results: string[] = [];
    bibleText.forEach((paragraph, index) => {
      if (paragraph.toLowerCase().includes(term)) {
        const highlightedParagraph = paragraph.replace(
          new RegExp(`(${term})`, 'gi'),
          '<span class="bg-premium-gold/30 text-premium-gold font-bold p-0.5 rounded-sm">$1</span>'
        );
        results.push(`<span class="text-premium-gold text-sm font-medium mr-1">${index + 1}</span> ${highlightedParagraph}`);
      }
    });
    setSearchResults(results);
    setIsSearching(false);
  };

  const closeSearchOverlay = () => {
    setShowSearchOverlay(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleToggleMarkChapter = () => {
    const key = `${selectedBook}-${selectedChapter}-${selectedTranslation}`;
    const markedChapters = JSON.parse(localStorage.getItem('markedChapters') || '{}');
    if (isChapterMarked) {
      delete markedChapters[key];
      alert(`Capítulo ${selectedChapter} de ${selectedBook} desmarcado.`);
    } else {
      markedChapters[key] = true;
      alert(`Capítulo ${selectedChapter} de ${selectedBook} marcado!`);
    }
    localStorage.setItem('markedChapters', JSON.stringify(markedChapters));
    setIsChapterMarked(!isChapterMarked);
  };

  const handleShareVerse = () => {
    const verseText = selectedVerse !== null ? bibleText[selectedVerse - 1] : '';
    const shareContent = selectedVerse !== null
      ? `"${verseText}" - ${selectedBook} ${selectedChapter}:${selectedVerse} ${selectedTranslation}`
      : `Lendo ${selectedBook} ${selectedChapter} ${selectedTranslation} no app Devocional Inteligente.`;

    if (navigator.share) {
      navigator.share({
        title: 'Versículo da Bíblia',
        text: shareContent,
      })
      .then(() => console.log('Conteúdo compartilhado com sucesso!'))
      .catch((error) => console.error('Erro ao compartilhar:', error));
    } else {
      alert(`Compartilhar: "${shareContent}"`);
      console.log('Web Share API não suportada. Conteúdo para compartilhar:', shareContent);
    }
  };

  const handleEditVerse = () => {
    if (selectedVerse !== null) {
      alert(`Função de edição para o versículo ${selectedVerse} em desenvolvimento!`);
    } else {
      alert('Selecione um versículo para editar.');
    }
  };

  const handleAddNote = () => {
    if (selectedVerse !== null) {
      alert(`Função de anotações para o versículo ${selectedVerse} em desenvolvimento!`);
    } else {
      alert('Selecione um versículo para adicionar uma nota.');
    }
  };

  const handleVerseClick = (verseNumber: number) => {
    setSelectedVerse(selectedVerse === verseNumber ? null : verseNumber);
  };

  return (
    <div className="relative flex h-screen min-h-screen w-full flex-col overflow-hidden bg-background-dark">
      {/* Background radial gradient blur effect */}
      <div className="absolute top-0 left-0 w-full h-96 bg-radial-top-dark from-premium-gold/10 via-background-dark/50 to-background-dark pointer-events-none z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex shrink-0 items-center justify-start">
            <button
              className="group flex items-center justify-center size-10 rounded-full transition-all hover:bg-surface-dark"
              onClick={() => setActiveScreen(AppScreen.Devotional)}
              aria-label="Voltar para a tela inicial"
            >
              <span className="material-symbols-outlined text-text-muted group-hover:text-premium-gold transition-colors text-2xl">arrow_back</span>
            </button>
          </div>
          <div className="flex flex-col items-center cursor-pointer group">
            <h1
              className="font-serif text-xl tracking-wide text-text-white group-hover:text-premium-gold transition-colors duration-300"
              onClick={() => setShowChapterSelection(prev => !prev)}
              aria-expanded={showChapterSelection}
              aria-controls="chapter-selection-dropdown"
              aria-label={`Livro e capítulo selecionados: ${selectedBook} ${selectedChapter}`}
            >
              {selectedBook.toUpperCase()} {selectedChapter}
            </h1>
            <div className="flex items-center gap-1 mt-0.5">
              <p
                className="text-[10px] uppercase tracking-[0.2em] text-premium-gold font-medium"
                onClick={() => setShowTranslationSelection(prev => !prev)}
                aria-expanded={showTranslationSelection}
                aria-controls="translation-selection-dropdown"
                aria-label={`Tradução selecionada: ${selectedTranslation}`}
              >
                {selectedTranslation}
              </p>
              <span className="material-symbols-outlined text-premium-gold" style={{ fontSize: '12px' }}>expand_more</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-2">
            <button
              className="group flex items-center justify-center size-10 rounded-full transition-all hover:bg-surface-dark"
              onClick={() => setShowSearchOverlay(true)}
              aria-label="Abrir busca"
            >
              <span className="material-symbols-outlined text-text-muted group-hover:text-premium-gold transition-colors text-2xl">search</span>
            </button>
            <button
              className="relative group flex items-center justify-center size-10 rounded-full transition-all hover:bg-surface-dark"
              onClick={() => setShowFontSizeOptions(prev => !prev)}
              aria-expanded={showFontSizeOptions}
              aria-controls="font-size-options"
              aria-label="Ajustar tamanho da fonte"
            >
              <span className="material-symbols-outlined text-text-muted group-hover:text-premium-gold transition-colors text-2xl">format_size</span>
              {showFontSizeOptions && (
                <div
                  id="font-size-options"
                  className="absolute top-full right-0 mt-2 w-24 bg-surface-dark border border-white/10 rounded-lg shadow-lg p-2 flex flex-col gap-1 z-40"
                  role="menu"
                >
                  <button
                    className={`px-3 py-1 text-sm rounded hover:bg-white/10 ${currentFontSize === 'sm' ? 'bg-premium-gold/20 text-premium-gold' : 'text-text-white'}`}
                    onClick={() => { setCurrentFontSize('sm'); setShowFontSizeOptions(false); }}
                    role="menuitem"
                  >
                    Pequena
                  </button>
                  <button
                    className={`px-3 py-1 text-base rounded hover:bg-white/10 ${currentFontSize === 'md' ? 'bg-premium-gold/20 text-premium-gold' : 'text-text-white'}`}
                    onClick={() => { setCurrentFontSize('md'); setShowFontSizeOptions(false); }}
                    role="menuitem"
                  >
                    Média
                  </button>
                  <button
                    className={`px-3 py-1 text-lg rounded hover:bg-white/10 ${currentFontSize === 'lg' ? 'bg-premium-gold/20 text-premium-gold' : 'text-text-white'}`}
                    onClick={() => { setCurrentFontSize('lg'); setShowFontSizeOptions(false); }}
                    role="menuitem"
                  >
                    Grande
                  </button>
                </div>
              )}
            </button>
          </div>
        </div>
        {/* Chapter/Book/Translation selection dropdowns */}
        {showChapterSelection && (
          <div id="chapter-selection-dropdown" className="absolute top-full left-0 right-0 bg-surface-dark border-b border-white/10 shadow-lg p-4 z-30" role="dialog" aria-modal="true">
            <div className="flex space-x-2 mb-4">
              <select
                value={selectedBook}
                onChange={(e) => { setSelectedBook(e.target.value); setSelectedChapter(1); setShowChapterSelection(false); }}
                className="flex-1 p-2 border border-white/10 rounded-lg bg-background-dark text-text-white focus:ring-premium-gold focus:border-premium-gold"
                aria-label="Selecionar livro da Bíblia"
              >
                {BIBLE_BOOKS.map((book) => (
                  <option key={book.name} value={book.name}>{book.name}</option>
                ))}
              </select>
              <select
                value={selectedChapter}
                onChange={(e) => { setSelectedChapter(Number(e.target.value)); setShowChapterSelection(false); }}
                className="flex-1 p-2 border border-white/10 rounded-lg bg-background-dark text-text-white focus:ring-premium-gold focus:border-premium-gold"
                aria-label="Selecionar capítulo"
              >
                {Array.from({ length: chaptersInSelectedBook }, (_, i) => i + 1).map((chapter) => (
                  <option key={chapter} value={chapter}>Capítulo {chapter}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        {showTranslationSelection && (
          <div id="translation-selection-dropdown" className="absolute top-full left-0 right-0 bg-surface-dark border-b border-white/10 shadow-lg p-4 z-30" role="dialog" aria-modal="true">
            <select
              value={selectedTranslation}
              onChange={(e) => { setSelectedTranslation(e.target.value); setShowTranslationSelection(false); }}
              className="w-full p-2 border border-white/10 rounded-lg bg-background-dark text-text-white focus:ring-premium-gold focus:border-premium-gold"
              aria-label="Selecionar tradução da Bíblia"
            >
              {BIBLE_TRANSLATIONS.map((translation) => (
                <option key={translation.id} value={translation.id}>{translation.name} ({translation.id})</option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      {showSearchOverlay && (
        <div className="fixed inset-0 bg-background-dark/95 backdrop-blur-md z-50 flex flex-col p-6" role="dialog" aria-modal="true" aria-label="Overlay de busca na Bíblia">
          <div className="flex items-center justify-between mb-6">
            <button
              className="group flex items-center justify-center size-10 rounded-full transition-all hover:bg-surface-dark"
              onClick={closeSearchOverlay}
              aria-label="Fechar busca"
            >
              <span className="material-symbols-outlined text-text-muted group-hover:text-premium-gold transition-colors text-2xl">arrow_back</span>
            </button>
            <h2 className="font-serif text-xl tracking-wide text-text-white">Buscar na Bíblia</h2>
            <div className="size-10"></div> {/* Spacer for alignment */}
          </div>
          <div className="mb-4">
            <Input
              id="search-bible-input"
              placeholder="Pesquisar por palavra-chave ou frase..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  performSearch();
                }
              }}
              autoFocus
              aria-label="Campo de busca"
            />
            <Button onClick={performSearch} fullWidth className="mt-2" disabled={isSearching} aria-label="Executar busca">
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4" aria-live="polite">
            {searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <p key={index} className="text-base leading-relaxed text-text-muted">
                  <span dangerouslySetInnerHTML={{ __html: result }} />
                </p>
              ))
            ) : searchTerm.trim() && !isSearching ? (
              <p className="text-center text-text-muted italic">Nenhum resultado encontrado para "{searchTerm}".</p>
            ) : (
              <p className="text-center text-text-muted italic">Digite para buscar no capítulo atual.</p>
            )}
          </div>
        </div>
      )}


      {/* Main Content (hidden when search overlay is active) */}
      {!showSearchOverlay && (
        <>
          <main ref={mainScrollRef} className="flex-1 overflow-y-auto px-6 pb-48 pt-6 relative z-10 scroll-smooth">
            <div className="max-w-xl mx-auto">
              <div className="mb-8 text-center opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
                <h2 className="font-display text-4xl text-text-white italic">O Princípio</h2> {/* Mock Chapter Title */}
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-premium-gold/50 to-transparent mx-auto mt-4"></div>
              </div>
              <div className={`${fontSizes[currentFontSize]} space-y-6 text-lg leading-loose font-light text-text-muted text-justify-custom`}>
                {bibleText.map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className={`group transition-colors duration-300 hover:text-text-white cursor-pointer ${selectedVerse === pIndex + 1 ? 'bg-premium-gold/20 rounded-md p-1 -m-1 text-text-white shadow-sm' : ''}`}
                    onClick={() => handleVerseClick(pIndex + 1)}
                    aria-label={`Versículo ${pIndex + 1}`}
                  >
                    <span className={`font-serif text-premium-gold ${pIndex === 0 ? 'text-xl mr-1 font-semibold opacity-80 group-hover:opacity-100' : 'text-sm mr-1 font-medium align-top group-hover:opacity-100 transition-opacity'}`}>
                      {pIndex + 1}
                    </span>
                    {pIndex === 0 ? (
                      <span className="first-letter:text-5xl first-letter:font-display first-letter:text-text-white first-letter:float-left first-letter:mr-2 first-letter:leading-none">{paragraph.substring(0, 1)}</span>
                    ) : null}
                    {pIndex === 0 ? paragraph.substring(1) : paragraph}
                  </p>
                ))}
              </div>
              
              {/* Bottom Navigation for Chapters */}
              <div className="mt-16 mb-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
                <button
                  onClick={handlePreviousChapter}
                  className="group flex flex-col items-center justify-center gap-1 text-center transition-colors hover:text-premium-gold"
                  aria-label="Ir para capítulo anterior"
                >
                  <span className="material-symbols-outlined rounded-full border border-white/10 bg-white/5 p-3 text-xl transition-all group-hover:border-premium-gold/30 group-hover:bg-premium-gold/10">arrow_back</span>
                  <span className="text-xs font-medium text-text-muted group-hover:text-text-white">Anterior</span>
                </button>

                <button
                  onClick={() => setShowChapterSelection(prev => !prev)}
                  className="group flex flex-col items-center justify-center gap-1 text-center transition-colors hover:text-premium-gold"
                  aria-label="Selecionar capítulo"
                >
                  <span className="material-symbols-outlined rounded-full border border-white/10 bg-white/5 p-3 text-xl transition-all group-hover:border-premium-gold/30 group-hover:bg-premium-gold/10">format_list_bulleted</span>
                  <span className="text-xs font-medium text-text-muted group-hover:text-text-white">Capítulos</span>
                </button>

                <button
                  onClick={handleNextChapter}
                  className="group flex flex-col items-center justify-center gap-1 text-center transition-colors hover:text-premium-gold"
                  aria-label="Ir para próximo capítulo"
                >
                  <span className="material-symbols-outlined rounded-full border border-white/10 bg-white/5 p-3 text-xl transition-all group-hover:border-premium-gold/30 group-hover:bg-premium-gold/10">arrow_forward</span>
                  <span className="text-xs font-medium text-text-muted group-hover:text-text-white">Próximo</span>
                </button>
              </div>

              <div className="h-8"></div> {/* Spacer at the end of content */}
            </div>
          </main>

          {/* New Floating Contextual Bar */}
          <div className="fixed bottom-[88px] left-0 right-0 z-30 flex justify-center pointer-events-none px-6">
            <div className="pointer-events-auto bg-surface-dark/80 backdrop-blur-2xl border border-white/10 rounded-full shadow-card px-4 py-3 flex items-center justify-between gap-4 max-w-md w-full">
              {/* Anterior Button (Mini) */}
              <Button
                onClick={handlePreviousChapter}
                variant="ghost"
                className="!p-2 !rounded-full text-sm font-sans flex items-center gap-1.5 text-text-muted hover:text-premium-gold hover:bg-white/5"
                aria-label="Capítulo anterior"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </Button>

              {/* Central Icon Group */}
              <div className="flex items-center gap-2"> {/* Reduced gap for a tighter cluster */}
                <button
                  className="flex items-center justify-center size-10 rounded-full group hover:bg-white/5 transition-all duration-300"
                  onClick={handleEditVerse}
                  aria-label="Editar versículo"
                >
                    <span className="material-symbols-outlined text-xl text-text-muted group-hover:text-premium-gold">edit</span>
                </button>
                <button
                  className="flex items-center justify-center size-10 rounded-full group hover:bg-white/5 transition-all duration-300"
                  onClick={handleAddNote}
                  aria-label="Adicionar nota ao versículo"
                >
                    <span className="material-symbols-outlined text-xl text-text-muted group-hover:text-premium-gold">description</span>
                </button>
                {/* Highlighted 'Marcar' icon, matching image */}
                <button
                  className={`flex items-center justify-center size-10 rounded-full transition-all duration-300 ${isChapterMarked ? 'bg-premium-gold/10 text-premium-gold icon-filled shadow-gold-glow' : 'group hover:bg-white/5 text-text-muted group-hover:text-premium-gold'}`}
                  onClick={handleToggleMarkChapter}
                  aria-label={isChapterMarked ? "Desmarcar capítulo" : "Marcar capítulo"}
                >
                    <span className="material-symbols-outlined text-xl">{isChapterMarked ? 'bookmark' : 'bookmark_border'}</span>
                </button>
                <button
                  className="flex items-center justify-center size-10 rounded-full group hover:bg-white/5 transition-all duration-300"
                  onClick={handleShareVerse}
                  aria-label="Compartilhar versículo ou capítulo"
                >
                    <span className="material-symbols-outlined text-xl text-text-muted group-hover:text-premium-gold">share</span>
                </button>
              </div>

              {/* Próximo Button (Mini) */}
              <Button
                onClick={handleNextChapter}
                variant="ghost"
                className="!p-2 !rounded-full text-sm font-sans flex items-center gap-1.5 text-text-muted hover:text-premium-gold hover:bg-white/5"
                aria-label="Próximo capítulo"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BibleScreen;
