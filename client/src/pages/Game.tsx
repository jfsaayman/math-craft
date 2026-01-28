import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Star, Trophy, ArrowLeft, Clock, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { Keypad } from "@/components/game/Keypad";
import { generateProblem, type Operation, type Difficulty, type Problem } from "@/lib/game-logic";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function Game() {
  const [location, setLocation] = useLocation();
  
  // Parse query params manually since wouter's useSearch is minimal
  const searchParams = new URLSearchParams(window.location.search);
  const mode = (searchParams.get("mode") as 'practice' | 'time-attack') || 'practice';
  const op = (searchParams.get("op") as Operation) || 'multiply';
  const diff = (searchParams.get("diff") as Difficulty) || 'cadet';

  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(mode === 'time-attack' ? 60 : 0);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [streak, setStreak] = useState(0);

  // Initialize
  useEffect(() => {
    nextProblem();
  }, []);

  // Timer for Time Attack
  useEffect(() => {
    if (mode === 'time-attack' && gameState === 'playing' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [mode, gameState, timeLeft]);

  const nextProblem = () => {
    setProblem(generateProblem(op, diff));
    setInput("");
    setFeedback('none');
  };

  const finishGame = () => {
    setGameState('finished');
    if (score > 0) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#00FFFF', '#FF00FF']
      });
    }
  };

  const handleInput = (num: number) => {
    if (input.length < 3) {
      setInput((prev) => prev + num.toString());
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    if (!problem || !input) return;

    const val = parseInt(input);
    if (val === problem.answer) {
      // Correct
      setScore((s) => s + 10 + (streak * 2)); // Bonus for streak
      setStreak((s) => s + 1);
      setFeedback('correct');
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#00FFFF', '#FFFFFF']
      });
      setTimeout(nextProblem, 800);
    } else {
      // Wrong
      setFeedback('wrong');
      setStreak(0);
      // Shake effect logic handled by framer-motion variants
      setTimeout(() => {
        setInput("");
        setFeedback('none');
      }, 500);
    }
  };

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen bg-[url('/assets/hero-space-bg.png')] bg-cover bg-center flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/40 backdrop-blur-xl border-white/20 p-8 text-center space-y-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="space-y-4"
          >
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            <h1 className="text-4xl font-display text-white">Mission Complete!</h1>
            <div className="text-6xl font-bold text-primary font-body">{score}</div>
            <p className="text-white/60">Total Score</p>
          </motion.div>

          <div className="flex gap-4 justify-center">
            <Button variant="outline" size="lg" onClick={() => setLocation('/')}>
              <ArrowLeft className="mr-2 h-5 w-5" /> Base
            </Button>
            <Button size="lg" onClick={() => window.location.reload()}>
              <Rocket className="mr-2 h-5 w-5" /> Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/assets/hero-space-bg.png')] bg-cover bg-center flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 bg-black/30 backdrop-blur-md p-4 rounded-2xl border border-white/10">
        <Link href="/">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <ArrowLeft />
          </Button>
        </Link>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-yellow-400">
            <Star className="fill-current" />
            <span className="text-2xl font-bold font-body">{score}</span>
          </div>
          
          {mode === 'time-attack' && (
            <div className="flex items-center gap-2 text-primary">
              <Clock />
              <span className={`text-2xl font-bold font-body ${timeLeft < 10 ? 'text-red-500 animate-pulse' : ''}`}>
                {timeLeft}s
              </span>
            </div>
          )}

          {streak > 2 && (
             <div className="flex items-center gap-1 text-orange-400 animate-pulse">
               <Zap className="fill-current w-5 h-5" />
               <span className="font-bold">x{streak}</span>
             </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 w-full max-w-md flex flex-col justify-center gap-8">
        
        {/* Mascot & Problem */}
        <div className="relative">
          <motion.img 
            src="/assets/mascot-robot.png" 
            alt="Robot"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 absolute -top-24 -right-4 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]"
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={problem?.display}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: feedback === 'wrong' ? [0, -10, 10, -10, 10, 0] : 0 
              }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ type: "spring" }}
              className={cn(
                "bg-card/80 backdrop-blur-xl border-2 rounded-[2rem] p-12 text-center shadow-2xl relative overflow-hidden",
                feedback === 'correct' ? "border-green-500 bg-green-500/10" : "border-white/10",
                feedback === 'wrong' ? "border-red-500 bg-red-500/10" : ""
              )}
            >
              <div className="text-6xl md:text-7xl font-bold text-white font-body tracking-wider">
                {problem ? (
                  <>
                    {problem.display.split('?')[0]}
                    <span className="text-primary border-b-4 border-primary/50 min-w-[2ch] inline-block px-2">
                      {input || "?"}
                    </span>
                  </>
                ) : "Loading..."}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Keypad */}
        <Keypad 
          onInput={handleInput} 
          onDelete={handleDelete} 
          onSubmit={handleSubmit}
          disabled={feedback !== 'none'}
        />

      </div>
    </div>
  );
}
