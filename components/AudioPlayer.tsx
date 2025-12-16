import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';

interface AudioPlayerProps {
  audioBuffer: AudioBuffer | null;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBuffer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Clean up audio resources when component unmounts or audioBuffer changes
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [audioBuffer]);

  const playAudio = () => {
    if (audioBuffer) {
      if (!audioContextRef.current) {
        audioContextRef.current = new window.AudioContext();
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
        sourceNodeRef.current = null;
      }

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      setIsPlaying(true);

      source.onended = () => {
        setIsPlaying(false);
        sourceNodeRef.current = null;
      };
      sourceNodeRef.current = source;
    }
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  if (!audioBuffer) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 mt-4 rounded-full bg-accent-surface p-2 border border-white/5 shadow-lg">
      <Button
        onClick={isPlaying ? stopAudio : playAudio}
        disabled={!audioBuffer}
        className="size-12 flex-shrink-0 flex items-center justify-center !rounded-full bg-gold-gradient shadow-lg shadow-premium-gold/20 hover:scale-105 active:scale-95 text-background-dark !p-0"
      >
        {isPlaying ? (
          <span className="material-symbols-outlined text-2xl icon-filled">pause</span>
        ) : (
          <span className="material-symbols-outlined text-2xl icon-filled">play_arrow</span>
        )}
      </Button>
      <div className="flex-1 space-y-1 pr-2">
        <p className="text-sm font-medium text-text-white font-display">Devocional de Hoje</p>
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
          {/* Mock progress bar */}
          <div className="h-full w-1/3 rounded-full bg-premium-gold"></div>
        </div>
      </div>
      <span className="text-xs font-mono text-white/40">1:42</span> {/* Mock duration */}
    </div>
  );
};

export default AudioPlayer;