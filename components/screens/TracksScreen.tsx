
import React, { useState } from 'react';
import { SPIRITUAL_TRACKS } from '../../constants';
import { SpiritualTrack, AppScreen } from '../../types';
import { useAppContext } from '../Layout';

interface SpiritualTrackCardProps {
  track: SpiritualTrack;
  isCompleted?: boolean;
}

const SpiritualTrackCard: React.FC<SpiritualTrackCardProps> = ({ track, isCompleted = false }) => {
  const { setActiveScreen } = useAppContext(); // Assuming we might navigate to a track detail screen
  const [isFavorited, setIsFavorited] = useState<boolean>(false); // Local state for favoriting

  const handleTrackClick = () => {
    alert(`Jornada "${track.title}" iniciada! Em breve você verá o conteúdo. (Funcionalidade em desenvolvimento)`);
    console.log(`Abrindo detalhes da jornada: ${track.title}`);
    // In a real app, this would navigate to a detailed view of the track
    // setActiveScreen(AppScreen.Devotional); // Example navigation
  };

  const handleToggleFavorite = () => {
    setIsFavorited(prev => !prev);
    alert(isFavorited ? `Jornada "${track.title}" removida dos favoritos.` : `Jornada "${track.title}" adicionada aos favoritos!`);
    console.log(`Toggle favorito para jornada: ${track.title}`);
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-background-card shadow-card-glow transition-transform hover:scale-[1.01] ${isCompleted ? 'border border-white/5 opacity-60 hover:opacity-100 shadow-none' : 'border-gold-subtle'}`}>
      <div className="absolute inset-0 bg-card-gradient pointer-events-none"></div>

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30 backdrop-blur-[2px] transition-opacity group-hover:opacity-0 group-hover:pointer-events-none">
          <div className="flex items-center gap-2 rounded-full bg-background-dark/80 border border-premium-gold/30 px-4 py-2 backdrop-blur-md">
            <span className="material-symbols-outlined text-premium-gold">check_circle</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-text-white">Concluída</span>
          </div>
        </div>
      )}

      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background-card via-transparent to-transparent z-10"></div>
        <div
          className={`h-full w-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${isCompleted ? 'grayscale opacity-80' : 'opacity-80'}`}
          style={{ backgroundImage: `url('${track.imageUrl}')` }}
        ></div>
        {(track.progress > 0 && track.progress < 100) && (
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleToggleFavorite}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10"
              aria-label={isFavorited ? "Remover jornada dos favoritos" : "Adicionar jornada aos favoritos"}
            >
              <span className={`material-symbols-outlined text-sm ${isFavorited ? 'text-premium-gold icon-filled' : 'text-text-white/70'}`}>bookmark</span>
            </button>
          </div>
        )}
      </div>
      <div className="relative z-20 -mt-12 px-5 pb-5 pt-0">
        <div className="mb-3 flex items-center gap-2">
          <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
            isCompleted
              ? 'bg-white/5 text-text-white/40 border-white/5'
              : 'bg-premium-gold/10 text-premium-gold border-premium-gold/20'
          }`}>
            {track.category || 'Jornada'}
          </span>
        </div>
        <h3 className="font-display text-xl font-medium text-text-white">{track.title}</h3>
        <p className="mt-1 text-xs font-light text-text-muted">{track.description}</p>

        {track.progress > 0 && !isCompleted && (
          <div className="mt-5 space-y-2">
            <div className="flex items-end justify-between text-xs">
              <span className="text-text-white/60">Progresso da Jornada</span>
              <span className="font-medium text-premium-gold">{track.progress}%</span>
            </div>
            <div className="relative h-1 w-full rounded-full bg-white/5">
              <div className="absolute left-0 top-0 h-full rounded-full bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.4)]" style={{ width: `${track.progress}%` }}></div>
            </div>
            <p className="text-[10px] text-text-muted text-right pt-1">{Math.round(track.progress / (100 / (track.daysCount || 1)))} de {track.daysCount || '?'} dias</p>
          </div>
        )}

        {isCompleted && (
          <div className="mt-5 space-y-2">
            <div className="flex items-end justify-between text-xs">
              <span className="text-text-white/40">Progresso Completo</span>
              <span className="font-medium text-premium-gold">100%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-premium-gold/20">
              <div className="h-full w-full rounded-full bg-premium-gold"></div>
            </div>
          </div>
        )}

        {!isCompleted && track.progress === 0 && (
          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span>{track.daysCount || '?'} Dias</span>
            </div>
            <button
              className="group/btn flex items-center gap-2 text-xs font-medium text-premium-gold transition-colors hover:text-text-white"
              onClick={handleTrackClick}
              aria-label={`Iniciar jornada ${track.title}`}
            >
              Iniciar Jornada
              <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TracksScreen: React.FC = () => {
  const { setActiveScreen } = useAppContext();
  const [filter, setFilter] = useState('Todas'); // 'Todas', 'Novas', 'Em Andamento', 'Concluídas'

  const filteredTracks = SPIRITUAL_TRACKS.filter(track => {
    if (filter === 'Todas') return true;
    if (filter === 'Novas') return track.progress === 0;
    if (filter === 'Em Andamento') return track.progress > 0 && track.progress < 100;
    if (filter === 'Concluídas') return track.progress === 100;
    return true;
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark overflow-x-hidden">
      <div className="flex flex-col gap-1 p-6 pb-2 pt-8">
        <div className="flex h-12 items-center justify-between">
          <button
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            onClick={() => setActiveScreen(AppScreen.Devotional)}
            aria-label="Voltar para a tela inicial"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div className="flex items-center gap-2 rounded-full border border-premium-gold/30 bg-premium-gold/10 px-3 py-1.5 backdrop-blur-md">
            <span className="material-symbols-outlined text-lg text-premium-gold icon-filled">military_tech</span>
            <span className="text-xs font-semibold tracking-wider text-premium-gold uppercase">Premium</span>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="font-display text-3xl font-medium tracking-wide text-text-white">Jornadas <br/><span className="text-gold-gradient font-semibold">Espirituais</span></h1>
          <p className="mt-2 text-sm font-light leading-relaxed text-text-muted">Trilhe o caminho do mestre. Aprofunde-se em cada passo.</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto px-6 py-4 scrollbar-hide" role="tablist">
        {['Todas', 'Novas', 'Em Andamento', 'Concluídas'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`group relative flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-full px-5 transition-colors ${
              filter === f
                ? 'bg-premium-gold shadow-gold-glow'
                : 'border border-white/10 bg-white/5 hover:bg-white/10'
            }`}
            role="tab"
            aria-selected={filter === f}
            aria-controls={`tracks-panel-${f}`}
          >
            {filter === f && <div className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></div>}
            <p className={`text-xs font-semibold uppercase tracking-wider ${filter === f ? 'text-background-dark' : 'text-text-white/80'}`}>{f}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 px-6 pb-28" id={`tracks-panel-${filter}`} role="tabpanel">
        {filteredTracks.length === 0 && (
          <p className="text-text-muted italic text-center mt-8">Nenhuma jornada encontrada para este filtro.</p>
        )}
        {filteredTracks.map((track) => (
          <SpiritualTrackCard key={track.id} track={track} isCompleted={track.progress === 100} />
        ))}
      </div>
    </div>
  );
};

export default TracksScreen;