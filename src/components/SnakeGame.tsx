/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GRID_SIZE, INITIAL_SNAKE } from '../types';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  gameColor: string;
}

const MOVE_SPEED = 150;

export default function SnakeGame({ onScoreChange, gameColor }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  
  const moveInterval = useRef<NodeJS.Timeout | null>(null);
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Ensure food doesn't spawn on snake
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection({ x: 0, y: -1 });
    directionRef.current = { x: 0, y: -1 };
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsStarted(true);
  };

  const wrapPoint = (p: number) => (p + GRID_SIZE) % GRID_SIZE;

  const move = useCallback(() => {
    setSnake(prev => {
      const head = prev[0];
      const newHead = {
        x: wrapPoint(head.x + directionRef.current.x),
        y: wrapPoint(head.y + directionRef.current.y),
      };

      // Collision with self
      if (prev.some(s => s.x === newHead.x && s.y === newHead.y)) {
        setIsGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];
      
      // Eat food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const next = s + 10;
          onScoreChange(next);
          return next;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, generateFood, onScoreChange]);

  useEffect(() => {
    if (isStarted && !isGameOver) {
      moveInterval.current = setInterval(move, MOVE_SPEED);
    } else {
      if (moveInterval.current) clearInterval(moveInterval.current);
    }
    return () => {
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
  }, [isStarted, isGameOver, move]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (directionRef.current.y === 0) directionRef.current = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (directionRef.current.x === 0) directionRef.current = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (directionRef.current.x === 0) directionRef.current = { x: 1, y: 0 }; break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, i) => {
      ctx.shadowBlur = i === 0 ? 20 : 10;
      ctx.shadowColor = gameColor;
      ctx.fillStyle = i === 0 ? gameColor : `${gameColor}cc`;
      
      const padding = i === 0 ? 2 : 4;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

  }, [snake, food, gameColor]);

  return (
    <div className="relative group p-4 glass-morphism rounded-3xl" id="snake-game-container">
      <div className="absolute inset-0 opacity-10 rounded-3xl transition-colors duration-700" style={{ backgroundColor: gameColor }} />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 flex justify-between w-full px-2">
            <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: gameColor }} />
                <span className="font-bold text-xl font-mono tracking-tighter" style={{ color: gameColor }}>{score.toString().padStart(4, '0')}</span>
            </div>
            <div className="text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] self-center">
                System Active // Grid V.2.0
            </div>
        </div>

        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black/40 rounded-2xl border border-white/5 cursor-none"
          id="game-canvas"
        />

        <AnimatePresence>
          {!isStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-4 top-24 bottom-4 z-20 flex flex-col items-center justify-center bg-black/80 rounded-2xl backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-4xl font-black mb-6 tracking-tighter text-center">NEON<br/><span style={{ color: gameColor }}>DIVER</span></h2>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 rounded-full font-bold uppercase tracking-widest text-black shadow-2xl hover:scale-105 active:scale-95 transition-transform"
                style={{ backgroundColor: gameColor }}
              >
                <Play className="w-5 h-5 fill-current" /> Start Run
              </button>
              <p className="mt-8 text-white/40 text-[10px] font-mono uppercase tracking-[0.1em]">Use Arrow Keys to Navigate</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-x-4 top-24 bottom-4 z-20 flex flex-col items-center justify-center bg-black/90 rounded-2xl border-4 border-red-500/50"
            >
              <h2 className="text-5xl font-black mb-2 text-red-500 italic tracking-tighter uppercase">Terminated</h2>
              <p className="text-white/60 mb-8 font-mono">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-full font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <RefreshCw className="w-5 h-5" /> Reboot
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
