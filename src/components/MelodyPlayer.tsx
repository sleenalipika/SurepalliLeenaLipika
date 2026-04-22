/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TRACKS, Track } from '../types';

interface MelodyPlayerProps {
  onTrackChange?: (track: Track) => void;
}

export default function MelodyPlayer({ onTrackChange }: MelodyPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrack, onTrackChange]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  return (
    <div className="glass-morphism rounded-3xl p-6 w-full max-w-md relative overflow-hidden group">
      {/* Decorative Blur */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 transition-colors duration-700" 
        style={{ backgroundColor: currentTrack.color }}
      />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
        crossOrigin="anonymous"
      />

      <div className="flex items-center gap-6 relative z-10">
        <div className="relative w-24 h-24 flex-shrink-0">
          <motion.img
            key={currentTrack.id}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover rounded-2xl shadow-2xl relative z-10"
          />
          <div 
            className="absolute -inset-1 blur-md opacity-40 rounded-2xl transition-colors duration-700"
            style={{ backgroundColor: currentTrack.color }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <motion.h3 
            key={`title-${currentTrack.id}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-xl font-black truncate tracking-tight uppercase"
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={`artist-${currentTrack.id}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-sm font-mono tracking-widest uppercase"
          >
            {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 h-full transition-colors duration-700"
            animate={{ width: `${progress}%` }}
            style={{ backgroundColor: currentTrack.color }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group/btn"
              id="music-prev"
            >
              <SkipBack className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full flex items-center justify-center text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: currentTrack.color }}
              id="music-play-pause"
            >
              {isPlaying ? <Pause className="fill-current" /> : <Play className="ml-1 fill-current" />}
            </button>
            <button 
              onClick={handleNext}
              className="p-2 hover:bg-white/10 rounded-full transition-colors group/btn"
              id="music-next"
            >
              <SkipForward className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
            <Volume2 className="w-5 h-5 text-white/70" />
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
               <div className="w-2/3 h-full bg-white/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
