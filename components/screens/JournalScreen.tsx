
import React, { useState } from 'react';
import Input from '../Input';
import Button from '../Button';
import { JournalEntry, Habit } from '../../types';
import { useAppContext } from '../Layout';

const JournalScreen: React.FC = () => {
  const { setActiveScreen } = useAppContext();
  const [activeTab, setActiveTab] = useState<'Diário' | 'Planner' | 'Progresso'>('Diário');
  const [newNote, setNewNote] = useState('');
  const [entries, setEntries] = useState<JournalEntry[]>([
    { id: '1', date: 'Hoje', content: 'Senti uma paz profunda durante a leitura de hoje. O versículo sobre o Bom Pastor realmente falou comigo.', tags: ['Paz'] },
    { id: '2', date: 'Ontem', content: 'Gratidão pela família e pela saúde. Um dia de novos recomeços.', tags: ['Gratidão'] }
  ]);
  
  const [habits, setHabits] = useState<Habit[]>([
    { id: 'h1', name: 'Leitura Bíblica', frequency: 'Diário', completedDates: [] },
    { id: 'h2', name: 'Oração', frequency: 'Diário', completedDates: [] },
    { id: 'h3', name: 'Devocional', frequency: 'Diário', completedDates: [] }
  ]);

  const handleSaveNote = () => {
    if (!newNote.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: 'Hoje',
      content: newNote,
      tags: ['Reflexão']
    };
    setEntries([entry, ...entries]);
    setNewNote('');
    alert('Reflexão guardada em seu memorial.');
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const completed = h.completedDates.includes(today);
        return { ...h, completedDates: completed ? [] : [today] };
      }
      return h;
    }));
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark animate-fade-in pb-32">
      <div className="sticky top-0 z-20 bg-background-dark/90 backdrop-blur-xl px-6 pt-10 pb-4 border-b border-white/5">
        <h1 className="font-display text-3xl text-text-white mb-6 italic">Memorial</h1>
        <div className="flex p-1 bg-surface-dark rounded-full border border-white/5">
          {['Diário', 'Planner', 'Progresso'].map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${activeTab === t ? 'bg-premium-gold text-background-dark' : 'text-text-muted hover:text-text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="p-6">
        {activeTab === 'Diário' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-card-dark p-6 rounded-3xl border border-white/5 shadow-xl">
              <textarea
                placeholder="O que Deus falou com você hoje?"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full bg-transparent border-none text-text-white placeholder:text-text-muted focus:ring-0 resize-none font-sans text-sm min-h-[100px]"
              />
              <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
                <span className="text-[10px] text-text-muted uppercase tracking-widest">{new Date().toLocaleDateString()}</span>
                <Button onClick={handleSaveNote} className="!py-2 !px-4 text-xs">Salvar</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-display text-lg text-text-white">Registros Passados</h3>
              {entries.map(e => (
                <div key={e.id} className="bg-card-dark/50 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-premium-gold font-bold uppercase tracking-tighter bg-premium-gold/10 px-2 py-0.5 rounded">{e.tags?.[0]}</span>
                    <span className="text-[10px] text-text-muted uppercase tracking-widest">{e.date}</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">{e.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Planner' && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-display text-lg text-text-white">Hábitos da Luz</h3>
            <div className="space-y-3">
              {habits.map(h => {
                const isDone = h.completedDates.includes(new Date().toISOString().split('T')[0]);
                return (
                  <div key={h.id} onClick={() => toggleHabit(h.id)} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${isDone ? 'bg-premium-gold/10 border-premium-gold/30' : 'bg-card-dark border-white/5 hover:border-premium-gold/20'}`}>
                    <div>
                      <p className={`text-sm font-medium ${isDone ? 'text-premium-gold' : 'text-text-white'}`}>{h.name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">{h.frequency}</p>
                    </div>
                    <span className={`material-symbols-outlined text-2xl ${isDone ? 'text-premium-gold icon-filled' : 'text-text-muted'}`}>
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'Progresso' && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-gold-gradient p-6 rounded-3xl text-background-dark shadow-lg-gold">
              <h3 className="font-display text-xl font-bold">Consistência</h3>
              <p className="text-sm font-medium opacity-80 mt-1">Sua alma está florescendo.</p>
              <div className="mt-6 flex justify-between items-end">
                <span className="text-4xl font-display font-bold italic">85%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Nesta Semana</span>
              </div>
              <div className="h-1.5 w-full bg-black/10 rounded-full mt-2">
                <div className="h-full bg-black/40 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card-dark p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-2xl font-display text-premium-gold">12</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Dias Seguidos</p>
              </div>
              <div className="bg-card-dark p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-2xl font-display text-premium-gold">42</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Orações</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalScreen;
