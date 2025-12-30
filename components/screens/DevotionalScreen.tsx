
import React, { useState, useEffect, useRef } from 'react';
import Button from '../Button';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import AudioPlayer from '../AudioPlayer';
import { DevotionalContent } from '../../types';
import { generateDevotional, generateAudioFromText } from '../../services/geminiService';
import { DEFAULT_DEVOTIONAL_PROMPT, MOCK_DEVOTIONAL } from '../../constants';
import { useAppContext } from '../Layout';
import ReactMarkdown from 'react-markdown';

const DevotionalScreen: React.FC = () => {
  const { theme, nightModeStory, loadNightModeStory, isNightModeStoryLoading, apiKey, triggerApiKeySelection } = useAppContext();
  const [moodOrTheme, setMoodOrTheme] = useState<string>('');
  const [devotional, setDevotional] = useState<DevotionalContent | null>(MOCK_DEVOTIONAL); // Inicializa com mock
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const [verseOfTheDay, setVerseOfTheDay] = useState<string>(MOCK_DEVOTIONAL.verse);
  const [verseTextOfTheDay, setVerseTextOfTheDay] = useState<string>(MOCK_DEVOTIONAL.reflection.split('.')[0] + "...");

  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (!hasGeneratedRef.current && apiKey) {
      handleGenerateDevotional('paz e esperança', true);
      hasGeneratedRef.current = true;
    }
  }, [apiKey]); 

  useEffect(() => {
    if (theme === 'dark' && !nightModeStory && !isNightModeStoryLoading && apiKey) {
      loadNightModeStory();
    }
  }, [theme, nightModeStory, isNightModeStoryLoading, loadNightModeStory, apiKey]);

  const handleGenerateDevotional = async (initialMoodOrTheme: string | null = null, isInitialLoad: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setAudioBuffer(null);

    if (!apiKey) {
      // Demo Mode: Se não tem API key, simula uma geração com o Mock
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDevotional(MOCK_DEVOTIONAL);
      setIsLoading(false);
      return;
    }

    const promptInput = initialMoodOrTheme !== null ? initialMoodOrTheme : moodOrTheme;
    
    if (!promptInput && !isInitialLoad) {
      setError('Por favor, insira um humor ou tema.');
      setIsLoading(false);
      return;
    }

    try {
      const generatedContent = await generateDevotional(apiKey, promptInput, DEFAULT_DEVOTIONAL_PROMPT);
      setDevotional(generatedContent);
      setVerseOfTheDay(generatedContent.verse);
      setVerseTextOfTheDay(generatedContent.reflection.split('.')[0] + '...');

      const audioText = `${generatedContent.reflection}\n\nOração: ${generatedContent.prayer}`;
      const buffer = await generateAudioFromText(apiKey, audioText);
      setAudioBuffer(buffer);

    } catch (err: any) {
      console.error('Failed to generate:', err);
      setError(err.message || 'Falha ao gerar. Usando devocional padrão.');
      setDevotional(MOCK_DEVOTIONAL);
    } finally {
      setIsLoading(false);
      if (!isInitialLoad) setMoodOrTheme('');
    }
  };

  const handleSaveVerse = () => alert(`Versículo "${verseOfTheDay}" salvo em seus favoritos!`);
  
  const handleShareVerse = async () => {
    const shareContent = `"${verseTextOfTheDay}" - ${verseOfTheDay} \n\nDescubra mais no app HINEMI!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'HINEMI: Versículo do Dia', text: shareContent });
      } else {
        await navigator.clipboard.writeText(shareContent);
        alert('Texto copiado para a área de transferência!');
      }
    } catch (e) {
      console.log('Share error', e);
    }
  };

  const handleAcceptChallenge = () => alert('Desafio aceito! Verifique seu progresso na aba Diário.');

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col animate-fade-in">
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background-dark/90 px-6 backdrop-blur-xl border-b border-white/5">
        <div>
          <p className="font-display text-2xl text-text-white">Bom dia, <span className="italic text-premium-gold">Filho(a).</span></p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-accent-surface px-3 py-1.5 border border-white/5">
          <span className="material-symbols-outlined text-premium-gold text-sm icon-filled">shutter_speed</span>
          <span className="text-xs font-medium text-text-white/80">7 dias</span>
        </div>
      </header>

      <main className="flex-1 px-5 pb-6 pt-6">
        <div className="mx-auto max-w-md space-y-8">
          <div className="relative overflow-hidden rounded-3xl bg-card-dark text-center shadow-2xl border border-white/5">
            <div className="absolute inset-0 bg-dark-gradient opacity-90"></div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-premium-gold/10 blur-[80px]"></div>
            <div className="relative z-10 p-8 flex flex-col justify-between min-h-[340px]">
              <h2 className="font-display text-3xl text-premium-gold-light mb-1">Versículo do Dia</h2>
              <p className="font-display text-xl leading-relaxed text-text-white/90 italic my-6">"{verseTextOfTheDay}"</p>
              <div>
                <p className="font-sans text-sm font-medium tracking-widest uppercase text-premium-gold">{verseOfTheDay}</p>
                <div className="mt-8 flex justify-center gap-4">
                  <button onClick={handleSaveVerse} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-premium-gold/20 transition-all">
                    <span className="material-symbols-outlined text-lg text-white/70">bookmark_border</span>
                  </button>
                  <button onClick={handleShareVerse} className="size-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-premium-gold/20 transition-all">
                    <span className="material-symbols-outlined text-lg text-white/70">ios_share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-card-dark border border-white/5 shadow-lg">
            <h2 className="font-display text-xl text-text-white mb-4">Como você está hoje?</h2>
            <Input
              id="mood-theme"
              placeholder="Ex: ansiedade, gratidão, cansaço..."
              value={moodOrTheme}
              onChange={(e) => setMoodOrTheme(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateDevotional()}
              className="mb-4"
            />
            <Button onClick={() => handleGenerateDevotional()} fullWidth disabled={isLoading}>
              {isLoading ? 'Escutando o céu...' : 'Gerar Devocional Diário'}
            </Button>
            {!apiKey && (
              <p className="text-[10px] text-text-muted mt-3 text-center uppercase tracking-tighter">Modo de Demonstração (Ative o Gemini no Perfil para IA real)</p>
            )}
          </div>

          {isLoading && <LoadingSpinner />}

          {devotional && !isLoading && (
            <div className="animate-fade-in space-y-8">
              {audioBuffer && <AudioPlayer audioBuffer={audioBuffer} />}
              
              <div className="space-y-4">
                <h3 className="font-display text-xl text-text-white pl-1 border-l-2 border-premium-gold/50">Reflexão</h3>
                <div className="rounded-2xl bg-card-dark p-6 border border-white/5">
                  <p className="text-sm leading-relaxed text-text-muted font-sans font-light">{devotional.reflection}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl text-text-white pl-1 border-l-2 border-premium-gold/50">Oração</h3>
                <div className="rounded-2xl bg-accent-surface/50 p-6 border border-white/5 italic text-text-white/80 font-display leading-relaxed text-center">
                  "{devotional.prayer}"
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-dark-gradient p-1 border border-premium-gold/20">
                <div className="bg-card-dark rounded-[22px] p-6 text-center">
                  <h3 className="font-display text-xl font-medium text-text-white mb-3">Desafio Prático</h3>
                  <p className="text-sm text-text-muted mb-6 font-sans">{devotional.action}</p>
                  <Button onClick={handleAcceptChallenge} className="w-full">ACEITAR O DESAFIO</Button>
                </div>
              </div>
            </div>
          )}

          {theme === 'dark' && (
            <div className="bg-card-dark p-6 rounded-2xl border border-white/5 mt-8">
              <h2 className="font-display text-xl text-premium-gold mb-3">Descanso em Deus</h2>
              {apiKey ? (
                <div className="prose dark:prose-invert text-sm text-text-muted">
                  <ReactMarkdown>{nightModeStory || 'Gere sua história de boa noite...'}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-text-muted mb-4">O modo descanso é potencializado pela IA.</p>
                  <Button variant="ghost" onClick={triggerApiKeySelection}>Conectar Gemini</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DevotionalScreen;
