
import React, { useState, useEffect } from 'react';
import Input from '../Input';
import Button from '../Button';
import { JournalEntry, Habit, Challenge, AppScreen } from '../../types';
import { useAppContext } from '../Layout';

// Mock data for initial display
const initialJournalEntries: JournalEntry[] = [
  { id: 'j1', date: '20.07.2024', content: 'Hoje meditei sobre as pequenas bênçãos do dia a dia. Mesmo nos momentos difíceis, a luz divina se faz presente...', tags: ['Gratidão'] },
  { id: 'j2', date: '19.07.2024', content: 'A espera tem sido um desafio, mas a oração tem fortalecido meu espírito. Lembrei da história de Jó e sua...', tags: ['Reflexão'] },
];

const initialHabits: Habit[] = [
  { id: 'h1', name: 'Leitura Bíblica', frequency: 'Diário', completedDates: [] },
  { id: 'h2', name: 'Oração Matinal', frequency: 'Diário', completedDates: [] },
  { id: 'h3', name: 'Culto Familiar', frequency: 'Semanal', completedDates: [] },
];

const initialChallenges: Challenge[] = [
  { id: 'c1', name: '30 Dias de Gratidão', description: 'Escrever 3 coisas pelas quais é grato diariamente.', completed: false },
  { id: 'c2', name: 'Jejum de Mídias Sociais', description: 'Abster-se de redes sociais por uma semana.', completed: false },
];

const JournalScreen: React.FC = () => {
  const { setActiveScreen } = useAppContext();
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries);
  const [newEntryContent, setNewEntryContent] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // State for selected tags
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [activeTab, setActiveTab] = useState<'Diário' | 'Planner' | 'Jornada'>('Diário');

  useEffect(() => {
    // Update tab indicator position
    const indicator = document.getElementById('tab-indicator');
    if (indicator) {
      let offset = 0;
      let width = 0;
      if (activeTab === 'Diário') {
        offset = 0; width = 32;
      } else if (activeTab === 'Planner') {
        offset = 33.33; width = 32;
      } else if (activeTab === 'Jornada') {
        offset = 66.66; width = 32;
      }
      indicator.style.transform = `translateX(${offset}%)`;
      indicator.style.width = `${width}%`;
    }
  }, [activeTab]);

  const addJournalEntry = () => {
    if (newEntryContent.trim()) {
      const newEntry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        content: newEntryContent.trim(),
        tags: selectedTags.length > 0 ? selectedTags : ['Geral'], // Use selected tags or default
      };
      setJournalEntries([newEntry, ...journalEntries]);
      setNewEntryContent('');
      setSelectedTags([]); // Clear selected tags after adding entry
    }
  };

  const toggleHabitCompletion = (habitId: string) => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        if (habit.completedDates.includes(today)) {
          return { ...habit, completedDates: habit.completedDates.filter(date => date !== today) };
        } else {
          return { ...habit, completedDates: [...habit.completedDates, today] };
        }
      }
      return habit;
    }));
  };

  const toggleChallengeCompletion = (challengeId: string) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, completed: !challenge.completed } : challenge
    ));
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleNotificationsClick = () => {
    alert('Função de notificações em desenvolvimento!');
    console.log('Notificações clicadas');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark group/design-root overflow-x-hidden">
      {/* Background blur effect */}
      <div className="fixed top-0 left-0 w-full h-96 bg-premium-gold/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none"></div>

      {/* Header and Tab Navigation */}
      <div className="sticky top-0 z-20 bg-background-dark/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center p-5 pb-3 justify-between">
          <button
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-dark/50 hover:bg-white/5 transition-colors"
            onClick={() => setActiveScreen(AppScreen.Devotional)}
            aria-label="Voltar para a tela inicial"
          >
            <span className="material-symbols-outlined text-premium-gold text-2xl">arrow_back</span>
          </button>
          <h1 className="text-text-white text-xl font-serif font-bold tracking-wide flex-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-premium-gold-light via-text-white to-premium-gold-light">HINEMI</h1>
          <button
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-surface-dark/50 hover:bg-white/5 transition-colors"
            onClick={handleNotificationsClick}
            aria-label="Ver notificações"
          >
            <span className="material-symbols-outlined text-premium-gold text-2xl">notifications</span>
          </button>
        </div>
        <div className="flex px-5 py-3">
          <div className="flex h-12 flex-1 items-center justify-center rounded-full bg-surface-dark border border-white/5 p-1 relative">
            <div className="absolute h-10 w-[32%] bg-white/5 rounded-full left-1 transition-all duration-300 ease-out" id="tab-indicator"></div>
            <label className="z-10 flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:text-premium-gold has-[:checked]:bg-white/5 text-text-muted text-xs font-medium uppercase tracking-wider transition-all duration-300">
              <span className="truncate">Diário</span>
              <input checked={activeTab === 'Diário'} onChange={() => setActiveTab('Diário')} className="invisible w-0" name="planner-section" type="radio" value="Diário" aria-label="Aba Diário"/>
            </label>
            <label className="z-10 flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:text-premium-gold has-[:checked]:bg-white/5 text-text-muted text-xs font-medium uppercase tracking-wider transition-all duration-300">
              <span className="truncate">Planner</span>
              <input checked={activeTab === 'Planner'} onChange={() => setActiveTab('Planner')} className="invisible w-0" name="planner-section" type="radio" value="Planner" aria-label="Aba Planner"/>
            </label>
            <label className="z-10 flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-full px-2 has-[:checked]:text-premium-gold has-[:checked]:bg-white/5 text-text-muted text-xs font-medium uppercase tracking-wider transition-all duration-300">
              <span className="truncate">Jornada</span>
              <input checked={activeTab === 'Jornada'} onChange={() => setActiveTab('Jornada')} className="invisible w-0" name="planner-section" type="radio" value="Jornada" aria-label="Aba Jornada"/>
            </label>
          </div>
        </div>
      </div>

      <main className="flex-1 pb-32">
        {activeTab === 'Diário' && (
          <>
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-text-white font-display text-3xl font-medium italic">Reflexão Diária</h2>
              <p className="text-text-muted text-sm font-light pt-2 leading-relaxed tracking-wide">Registre a voz de Deus em seu coração hoje.</p>
            </div>
            <div className="px-5 py-4">
              <div className="group relative rounded-2xl bg-surface-dark border border-white/10 shadow-xl shadow-black/40 overflow-hidden transition-all duration-500 hover:border-premium-gold/30">
                <div className="absolute top-0 left-0 w-1 h-full bg-premium-gold opacity-50"></div>
                <textarea
                  className="w-full bg-transparent p-5 text-text-white placeholder:text-white/20 placeholder:font-light focus:ring-0 border-none text-base font-light resize-none leading-relaxed tracking-wide min-h-[140px]"
                  placeholder="Escreva seus pensamentos..."
                  rows={4}
                  value={newEntryContent}
                  onChange={(e) => setNewEntryContent(e.target.value)}
                  aria-label="Escrever nova entrada no diário"
                ></textarea>
                <div className="flex items-center justify-between px-4 pb-4 pt-2 border-t border-white/5">
                  <span className="text-xs text-white/30 font-display italic">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                  <div className="flex items-center gap-3">
                    {['Gratidão', 'Reflexão', 'Inspiração'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-all hover:scale-110 ${selectedTags.includes(tag) ? 'bg-premium-gold text-background-dark' : 'bg-white/5 text-white/40 hover:bg-premium-gold hover:text-background-dark'}`}
                        aria-pressed={selectedTags.includes(tag)}
                        aria-label={`Marcar como ${tag}`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          {tag === 'Gratidão' ? 'sentiment_satisfied' : tag === 'Reflexão' ? 'spa' : 'lightbulb'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pt-8 pb-4 flex items-end justify-between">
              <h2 className="text-text-white font-display text-2xl font-medium tracking-tight">Memórias Sagradas</h2>
              <button
                onClick={addJournalEntry}
                className="text-premium-gold hover:text-premium-gold-light transition-colors text-xs uppercase tracking-widest font-semibold border-b border-premium-gold/30 pb-0.5"
                aria-label="Salvar nova entrada"
              >
                Salvar Entrada
              </button>
            </div>
            <div className="flex flex-col gap-4 px-5">
              {journalEntries.length === 0 && <p className="text-text-muted italic text-center mt-4">Nenhuma entrada ainda. Comece a escrever!</p>}
              {journalEntries.map((entry) => (
                <div key={entry.id} className="group relative flex flex-col gap-3 rounded-2xl bg-surface-dark border border-white/5 p-5 transition-all duration-300 hover:border-premium-gold/20 hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-2 w-2 rounded-full ${entry.tags?.[0] === 'Gratidão' ? 'bg-premium-gold' : 'bg-indigo-400'}`}></span>
                      <p className={`text-xs font-medium uppercase tracking-wider ${entry.tags?.[0] === 'Gratidão' ? 'text-premium-gold' : 'text-indigo-400'}`}>{entry.tags?.[0] || 'Geral'}</p>
                    </div>
                    <span className="text-xs text-white/40 font-serif">{entry.date}</span>
                  </div>
                  <div>
                    <h3 className={`text-lg font-display font-medium text-text-white mb-1 ${entry.tags?.[0] === 'Gratidão' ? 'group-hover:text-premium-gold-light' : 'group-hover:text-indigo-400'} transition-colors`}>{entry.content.split('.')[0]}...</h3>
                    <p className="text-sm font-light text-text-muted line-clamp-2 leading-relaxed">{entry.content}</p>
                  </div>
                  <div className="absolute top-5 right-4">
                    <button className="text-white/20 hover:text-text-white transition-colors" aria-label="Mais opções para esta entrada"><span className="material-symbols-outlined">more_horiz</span></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'Planner' && (
          <>
            <div className="px-6 pt-6 pb-2">
              <h2 className="text-text-white font-display text-3xl font-medium italic">Meu Planner Espiritual</h2>
              <p className="text-text-muted text-sm font-light pt-2 leading-relaxed tracking-wide">Organize seus hábitos e desafios para o crescimento.</p>
            </div>
            {/* Habits Section */}
            <div className="mb-8 bg-card-dark p-6 rounded-2xl shadow-card border border-white/5">
              <h2 className="text-xl font-display font-medium text-text-white mb-4">Meus Hábitos</h2>
              <div className="space-y-3">
                {habits.map(habit => (
                  <div key={habit.id} className="flex items-center justify-between p-3 bg-surface-lighter rounded-lg border border-white/10">
                    <span className="text-text-white">{habit.name} <span className="text-text-muted text-sm">({habit.frequency})</span></span>
                    <input
                      type="checkbox"
                      checked={habit.completedDates.includes(new Date().toISOString().slice(0, 10))}
                      onChange={() => toggleHabitCompletion(habit.id)}
                      className="form-checkbox h-5 w-5 text-premium-gold rounded-md bg-surface-dark border-white/20 focus:ring-premium-gold"
                      aria-label={`Completar hábito ${habit.name}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Challenges Section */}
            <div className="mb-8 bg-card-dark p-6 rounded-2xl shadow-card border border-white/5">
              <h2 className="text-xl font-display font-medium text-text-white mb-4">Meus Desafios</h2>
              <div className="space-y-3">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="p-3 bg-surface-lighter rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-text-white font-medium ${challenge.completed ? 'line-through text-text-muted' : ''}`}>
                        {challenge.name}
                      </span>
                      <input
                        type="checkbox"
                        checked={challenge.completed}
                        onChange={() => toggleChallengeCompletion(challenge.id)}
                        className="form-checkbox h-5 w-5 text-premium-gold rounded-md bg-surface-dark border-white/20 focus:ring-premium-gold"
                        aria-label={`Completar desafio ${challenge.name}`}
                      />
                    </div>
                    <p className="text-sm text-text-muted">{challenge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'Jornada' && (
          <>
            <div className="px-6 pt-10 pb-4">
              <h2 className="text-text-white font-display text-2xl font-medium tracking-tight">Jornada Espiritual</h2>
              <p className="text-text-muted text-xs font-light pt-1 uppercase tracking-widest">Caminhando para a semelhança de Cristo</p>
            </div>
            <div className="px-5">
              <div className="relative overflow-hidden rounded-2xl bg-card-dark border border-premium-gold/20 p-6 shadow-2xl">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-premium-gold/10 rounded-full blur-3xl"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                    <p className="font-display text-lg text-text-white font-medium">Fluxo Contínuo</p>
                    <p className="text-xs text-white/40 mt-1">Sua constância inspira</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 px-4 py-1.5 backdrop-blur-md">
                    <span className="material-symbols-outlined text-sm text-premium-gold icon-filled">local_fire_department</span>
                    <p className="text-sm font-bold text-premium-gold tracking-wide">7 Dias</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs text-white/60 font-medium uppercase tracking-wider">Progresso Atual</span>
                    <span className="text-2xl font-display italic text-premium-gold">60%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-surface-dark border border-white/5">
                    <div className="h-full w-3/5 rounded-full bg-gold-gradient shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
                  </div>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="mb-2 p-2 rounded-full bg-premium-gold/10 text-premium-gold">
                      <span className="material-symbols-outlined text-xl">trophy</span>
                    </div>
                    <p className="text-2xl font-display font-medium text-text-white">5<span className="text-sm text-white/30 font-sans mx-1">/</span>8</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Desafios</p>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex flex-col items-center justify-center hover:bg-white/10 transition-colors">
                    <div className="mb-2 p-2 rounded-full bg-indigo-400/10 text-indigo-400">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </div>
                    <p className="text-2xl font-display font-medium text-text-white">12<span className="text-sm text-white/30 font-sans mx-1">/</span>15</p>
                    <p className="text-[10px] uppercase tracking-widest text-white/50 mt-1">Hábitos</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 right-6 z-30">
        <button
          onClick={addJournalEntry}
          className="group flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-gold-gradient text-background-dark shadow-lg-gold transition-all duration-300 hover:scale-105 hover:shadow-xl-gold active:scale-95"
          aria-label="Adicionar nova entrada no diário"
        >
          <span className="material-symbols-outlined text-3xl transition-transform duration-300 group-hover:rotate-90">add</span>
        </button>
      </div>
    </div>
  );
};

export default JournalScreen;