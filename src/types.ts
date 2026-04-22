/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
  color: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export type Point = { x: number; y: number };

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Maestro',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7366708779.mp3', // Synthwave
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=400&auto=format&fit=crop',
    color: '#00f3ff',
  },
  {
    id: '2',
    title: 'Neon Rain',
    artist: 'Synth Soul',
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_03dcaa4f63.mp3', // Lo-fi
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop',
    color: '#ff00ff',
  },
  {
    id: '3',
    title: 'Data Ghost',
    artist: 'Glitch Core',
    url: 'https://cdn.pixabay.com/audio/2024/02/08/audio_245236f6d2.mp3', // Ambient/Electronic
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=400&auto=format&fit=crop',
    color: '#39ff14',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
