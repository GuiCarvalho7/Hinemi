
import React, { useState } from 'react';
import { SPIRITUAL_TRACKS } from '../../constants';
import { SpiritualTrack, AppScreen } from '../../types';
import { useAppContext } from '../Layout';

const TracksScreen: React.FC = () => {
  const { setActiveScreen } = useAppContext();
  const [filter, setFilter] = useState('Todas');
  const [tracks, setTracks] = useState<SpiritualTrack[]>(SPIRITUAL_TRACKS);

  const handleStartTrack = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, progress: 5 } : t));
    alert('Jornada iniciada! O conteúdo diário foi liberado em seu Início.');
  };

  const handleToggleFavorite = (id: string) => {
    alert('Jornada salva em sua biblioteca pessoal.');
  };

  const filteredTracks = tracks.filter(t => {
    if (filter === 'Todas') return true;
    if (filter === 'Novas') return t.progress === 0;
    if (filter === 'Em Andamento') return t.progress > 0 && t.progress < 100;
    if (filter === 'Concluídas') return t.progress === 100;
    return true;
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark animate-fade-in">
      <div className="p-6 pt-10">
        <h1 className="font-display text-3xl font-medium text-text-white">Jornadas <br/><span className="text-premium-gold">Espirituais</span></h1>
        <p className="mt-2 text-sm text-text-muted">Trilhas profundas para o seu crescimento diário.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto px-6 py-4 no-scrollbar">
        {['Todas', 'Novas', 'Em Andamento', 'Concluídas'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-premium-gold text-background-dark shadow-gold-glow' : 'bg-white/5 text-text-muted border border-white/5'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-6 pb-32">
        {filteredTracks.map(track => (
          <div key={track.id} className="relative overflow-hidden rounded-2xl bg-card-dark border border-white/5 shadow-xl transition-all hover:scale-[1.01]">
            <div className="aspect-video w-full relative">
              <img src={track.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-t from-card-dark to-transparent"></div>
              <button onClick={() => handleToggleFavorite(track.id)} className="absolute top-4 right-4 size-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10">
                <span className="material-symbols-outlined text-sm text-white/70">bookmark</span>
              </button>
            </div>
            <div className="p-5 -mt-10 relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-premium-gold bg-premium-gold/10 px-2 py-0.5 rounded border border-premium-gold/20">{track.category}</span>
              <h3 className="text-xl font-display text-text-white mt-2">{track.title}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{track.description}</p>
              
              {track.progress > 0 ? (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-[10px] text-text-muted uppercase tracking-wider">
                    <span>Progresso</span>
                    <span>{track.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-premium-gold shadow-gold-glow" style={{ width: `${track.progress}%` }}></div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-[10px] text-text-muted flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">timer</span> {track.daysCount} dias
                  </span>
                  <button onClick={() => handleStartTrack(track.id)} className="text-xs font-bold text-premium-gold uppercase tracking-widest hover:text-white transition-colors">Iniciar Agora</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TracksScreen;
