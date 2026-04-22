/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import MelodyPlayer from './components/MelodyPlayer';
import SnakeGame from './components/SnakeGame';
import { Track, TRACKS } from './types';
import { motion } from 'motion/react';
import { LayoutGrid, Music, Gamepad2, Info } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [score, setScore] = useState(0);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background Ambience */}
      <div 
        className="fixed inset-0 transition-colors duration-1000 -z-10"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${currentTrack.color}15 0%, #050505 100%)` 
        }}
      />
      
      {/* Visual Glitch Elements */}
      <div className="scanline" />
      
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-6xl flex justify-between items-end mb-8 px-4"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter italic uppercase leading-none">
            Neon<br/>
            <span style={{ color: currentTrack.color }} className="transition-colors duration-700">Beat</span>
          </h1>
        </div>
        
        <div className="flex gap-8 text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
          <div className="hidden md:block">
            <p className="mb-1 text-white/20">Status</p>
            <p className="text-white/80">Synchronized</p>
          </div>
          <div className="hidden md:block">
            <p className="mb-1 text-white/20">Frequency</p>
            <p className="text-white/80">44.1 KHZ</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-white/20">Terminal Id</p>
            <p className="text-white/80">A.I. STUDIO_v1.2</p>
          </div>
        </div>
      </motion.header>

      <main className="w-full max-w-6xl flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center relative z-10">
        
        {/* Sidebar / Music Player Section */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full lg:w-96 flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-white/40 px-2">
            <Music className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Audio Environment</span>
          </div>
          <MelodyPlayer onTrackChange={setCurrentTrack} />
          
          <div className="glass-morphism rounded-2xl p-4 text-[10px] font-mono leading-relaxed text-white/30 uppercase tracking-wider">
            <div className="flex items-center gap-2 mb-2 text-white/60">
              <Info className="w-3 h-3" />
              <span>Instruction Protocol</span>
            </div>
            Navigate the serpent to consume the data nodes. Avoid physical collision with your own trail. Audio tracks influence the visual bio-feedback system.
          </div>
        </motion.div>

        {/* Center / Game Section */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex-1 flex flex-col gap-6 items-center"
        >
          <div className="flex items-center gap-3 text-white/40 px-2 w-full justify-center">
            <Gamepad2 className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Simulation Grid</span>
          </div>
          <SnakeGame onScoreChange={setScore} gameColor={currentTrack.color} />
        </motion.div>

        {/* Right / Status Section (Visible on LG) */}
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="hidden xl:flex w-48 flex-col gap-8 py-8"
        >
          <div className="space-y-1 bg-white/5 p-4 rounded-xl border border-white/5">
            <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Session Rank</p>
            <p className="text-2xl font-black italic uppercase">B-Tier</p>
          </div>
          
          <div className="space-y-3">
             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    animate={{ width: `${Math.min(score, 100)}%` }}
                    className="h-full bg-white/40"
                />
             </div>
             <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Network Synchronization</p>
          </div>

          <div className="mt-auto">
             <LayoutGrid className="w-8 h-8 text-white/10" />
          </div>
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-12 text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] pb-8">
        Dark Neon // Simulation V.01 // {new Date().getFullYear()}
      </footer>

      {/* Extreme Low-Level Grain Filter */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay -z-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
