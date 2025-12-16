
import React, { useState, useEffect, useRef } from 'react';
import Button from '../Button';
import Input from '../Input';
import LoadingSpinner from '../LoadingSpinner';
import AudioPlayer from '../AudioPlayer';
import { DevotionalContent } from '../../types';
import { generateDevotional, generateAudioFromText } from '../../services/geminiService';
import { DEFAULT_DEVOTIONAL_PROMPT } from '../../constants';
import { useAppContext } from '../Layout';
import ReactMarkdown from 'react-markdown'; // For rendering night mode story

const DevotionalScreen: React.FC = () => {
  const { theme, nightModeStory, loadNightModeStory, isNightModeStoryLoading, getApiKey } = useAppContext();
  const [moodOrTheme, setMoodOrTheme] = useState<string>('');
  const [devotional, setDevotional] = useState<DevotionalContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);

  const [verseOfTheDay, setVerseOfTheDay] = useState<string>('Salmos 27:1');
  const [verseTextOfTheDay, setVerseTextOfTheDay] = useState<string>(
    "O Senhor é a minha luz e a minha salvação; de quem terei temor? O Senhor é a fortaleza da minha vida; a quem temerei?"
  );

  const hasGeneratedRef = useRef(false);

  // Initial devotional load
  useEffect(() => {
    if (!hasGeneratedRef.current && getApiKey()) {
      handleGenerateDevotional('paz e esperança', true);
      hasGeneratedRef.current = true;
    }
  }, [getApiKey]); // Added getApiKey to dependency array to ensure it runs when key is available

  // Night mode story load
  useEffect(() => {
    if (theme === 'dark' && !nightModeStory && !isNightModeStoryLoading) {
      loadNightModeStory();
    }
  }, [theme, nightModeStory, isNightModeStoryLoading, loadNightModeStory]);

  const handleGenerateDevotional = async (initialMoodOrTheme: string | null = null, isInitialLoad: boolean = false) => {
    setIsLoading(true);
    setError(null);
    setAudioBuffer(null);
    setDevotional(null);

    const promptInput = initialMoodOrTheme !== null ? initialMoodOrTheme : moodOrTheme;
    const apiKey = getApiKey();

    if (!apiKey) {
      setError('API Key não disponível. Por favor, selecione sua chave.');
      setIsLoading(false);
      return;
    }

    if (!promptInput && !isInitialLoad) {
      setError('Por favor, insira um humor, necessidade ou tema.');
      setIsLoading(false);
      return;
    }

    try {
      const generatedContent = await generateDevotional(apiKey, promptInput, DEFAULT_DEVOTIONAL_PROMPT);
      setDevotional(generatedContent);
      setVerseOfTheDay(generatedContent.verse);
      setVerseTextOfTheDay(generatedContent.reflection.split('.')[0] + '...'); // Use first sentence of reflection as verse text

      // Generate audio for the reflection and prayer
      const audioText = `${generatedContent.reflection}\n\nOração: ${generatedContent.prayer}`;
      const buffer = await generateAudioFromText(apiKey, audioText);
      setAudioBuffer(buffer);

    } catch (err: any) {
      console.error('Failed to generate devotional:', err);
      setError(err.message || 'Falha ao gerar devocional. Tente novamente.');
    } finally {
      setIsLoading(false);
      if (!isInitialLoad) {
        setMoodOrTheme(''); // Clear input after generation
      }
    }
  };

  const handleSaveVerse = () => {
    alert(`Versículo "${verseOfTheDay}" salvo com sucesso!`);
    console.log(`Salvar versículo: ${verseOfTheDay}`);
  };

  const handleShareVerse = () => {
    const shareContent = `"${verseTextOfTheDay}" - ${verseOfTheDay} \n\nDescubra mais no app Devocional Inteligente!`;
    if (navigator.share) {
      navigator.share({
        title: 'Versículo do Dia',
        text: shareContent,
      })
      .then(() => console.log('Versículo compartilhado com sucesso!'))
      .catch((error) => console.error('Erro ao compartilhar versículo:', error));
    } else {
      alert(`Compartilhar: "${shareContent}"`);
      console.log('Web Share API não suportada. Conteúdo para compartilhar:', shareContent);
    }
  };

  const handleAcceptChallenge = () => {
    alert('Desafio aceito! Que Deus te abençoe nesta jornada!');
    console.log('Desafio prático aceito!');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background-dark/90 px-6 backdrop-blur-xl border-b border-white/5">
        <div>
          <p className="font-display text-2xl text-text-white">Bom dia, <span className="italic text-premium-gold">Ana.</span></p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-accent-surface px-3 py-1.5 border border-white/5">
          <span className="material-symbols-outlined text-premium-gold text-sm icon-filled">shutter_speed</span>
          <span className="text-xs font-medium text-text-white/80">12 dias</span> {/* Mock Streak */}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-6 pt-6">
        <div className="mx-auto max-w-md space-y-8">
          {/* Verse of the Day Card */}
          <div className="relative overflow-hidden rounded-3xl bg-card-dark text-center shadow-2xl group transition-all duration-500 hover:shadow-premium-gold/10 border border-white/5">
            <div className="absolute inset-0 bg-dark-gradient opacity-90"></div>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-premium-gold/10 blur-[80px]"></div>
            <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-premium-gold/5 blur-[60px]"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 p-8 flex flex-col h-full justify-between min-h-[380px]">
              <div className="space-y-1">
                <h2 className="font-display text-3xl text-premium-gold-light mb-1">Versículo do Dia</h2>
                <div className="h-0.5 w-12 bg-premium-gold/30 mx-auto rounded-full"></div>
              </div>
              <div className="my-6">
                <p className="font-display text-xl leading-relaxed text-text-white/90 italic">
                  "{verseTextOfTheDay}"
                </p>
              </div>
              <div>
                <p className="font-sans text-sm font-medium tracking-widest uppercase text-premium-gold">{verseOfTheDay}</p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    className="group/btn flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    onClick={handleSaveVerse}
                    aria-label="Salvar versículo"
                  >
                    <span className="material-symbols-outlined text-lg text-white/70 group-hover/btn:text-white">bookmark_border</span>
                  </button>
                  <button
                    className="group/btn flex h-10 w-10 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    onClick={handleShareVerse}
                    aria-label="Compartilhar versículo"
                  >
                    <span className="material-symbols-outlined text-lg text-white/70 group-hover/btn:text-white">ios_share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          {audioBuffer && <AudioPlayer audioBuffer={audioBuffer} />}

          {/* Generate Custom Devotional */}
          <div className="mb-8 p-6 rounded-2xl bg-card-dark border border-white/5 shadow-lg">
            <h2 className="font-display text-xl text-text-white mb-4">Gerar Devocional Personalizado</h2>
            <Input
              id="mood-theme"
              placeholder="Ex: ansiedade, gratidão, propósito, paz..."
              value={moodOrTheme}
              onChange={(e) => setMoodOrTheme(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleGenerateDevotional();
                }
              }}
              className="mb-4"
              aria-label="Humor, necessidade ou tema para o devocional"
            />
            <Button onClick={() => handleGenerateDevotional()} fullWidth disabled={isLoading} aria-label="Gerar devocional diário">
              {isLoading ? 'Gerando...' : 'Gerar Devocional Diário'}
            </Button>
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>

          {isLoading && <LoadingSpinner />}

          {devotional && (
            <>
              {/* Reflection */}
              <div className="space-y-6">
                <h3 className="font-display text-xl text-text-white pl-1 border-l-2 border-premium-gold/50">Reflexão</h3>
                <div className="group relative overflow-hidden rounded-2xl bg-card-dark p-6 border border-white/5 hover:border-premium-gold/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-premium-gold/10 text-premium-gold">
                      <span className="material-symbols-outlined text-lg">lightbulb</span>
                    </span>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-text-white/90 uppercase tracking-wide">Direção</h4>
                      <p className="text-sm leading-relaxed text-text-muted font-sans font-light">{devotional.reflection}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prayer */}
              <div className="space-y-4">
                <h3 className="font-display text-xl text-text-white pl-1 border-l-2 border-premium-gold/50">Oração</h3>
                <div className="rounded-2xl bg-accent-surface/50 p-6 border border-white/5 italic text-text-white/80 font-display leading-relaxed text-center">
                  "{devotional.prayer}"
                </div>
              </div>

              {/* Action / Desafio Prático */}
              <div className="relative overflow-hidden rounded-3xl bg-dark-gradient p-1 border border-premium-gold/20 gold-glow">
                <div className="bg-card-dark rounded-[22px] p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-premium-gold/5 opacity-30 shimmer"></div>
                  <h3 className="font-display text-xl font-medium text-text-white mb-3 relative z-10">Desafio Prático</h3>
                  <p className="text-sm text-text-muted mb-6 leading-relaxed relative z-10 font-sans">
                    {devotional.action}
                  </p>
                  <Button
                    className="!rounded-full w-full relative z-10 py-3.5 font-sans text-sm font-bold tracking-wide text-background-dark shadow-lg shadow-premium-gold/10 hover:shadow-premium-gold/20 hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleAcceptChallenge}
                    aria-label="Aceitar o desafio prático"
                  >
                    ACEITAR O DESAFIO
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Night Mode Story */}
          {theme === 'dark' && (
            <div className="bg-card-dark text-text-white p-6 rounded-2xl shadow-lg mt-8 relative overflow-hidden border border-white/5">
              <h2 className="font-display text-xl text-premium-gold mb-3">História para Acalmar a Alma</h2>
              {isNightModeStoryLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="prose dark:prose-invert text-base leading-relaxed text-text-muted font-sans">
                  <ReactMarkdown>{nightModeStory || 'Carregando uma história tranquila para sua noite...'}</ReactMarkdown>
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