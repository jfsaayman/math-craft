import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Calculator, Zap, Trophy, Play } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [difficulty, setDifficulty] = useState<'cadet' | 'pilot' | 'commander'>('cadet');
  const [operation, setOperation] = useState<'multiply' | 'divide'>('multiply');
  const [mode, setMode] = useState<'practice' | 'time-attack'>('practice');

  return (
    <div className="min-h-screen bg-[url('/assets/hero-space-bg.png')] bg-cover bg-center overflow-hidden relative">
      <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-block p-4 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 mb-4 shadow-[0_0_30px_rgba(100,200,255,0.2)]">
            <Rocket className="w-12 h-12 text-primary animate-bounce-slight" />
          </div>
          <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 drop-shadow-lg">
            Math Quest
          </h1>
          <p className="text-xl text-blue-200 font-medium">Space Academy Training</p>
        </motion.div>

        {/* Main Menu Card */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-4xl grid md:grid-cols-2 gap-8"
        >
          
          {/* Left Column: Settings */}
          <Card className="bg-card/40 backdrop-blur-xl border-white/10 p-6 space-y-8 h-full">
            
            {/* Operation Selection */}
            <div className="space-y-3">
              <label className="text-sm uppercase tracking-wider text-blue-300 font-bold">Mission Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setOperation('multiply')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    operation === 'multiply' 
                      ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(50,255,255,0.3)]" 
                      : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
                  )}
                >
                  <span className="text-3xl">×</span>
                  <span className="font-bold">Multiplication</span>
                </button>
                <button 
                  onClick={() => setOperation('divide')}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                    operation === 'divide' 
                      ? "bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(255,100,200,0.3)]" 
                      : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
                  )}
                >
                  <span className="text-3xl">÷</span>
                  <span className="font-bold">Division</span>
                </button>
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="text-sm uppercase tracking-wider text-blue-300 font-bold">Difficulty Level</label>
              <div className="space-y-2">
                {[
                  { id: 'cadet', label: 'Cadet', desc: 'Numbers 1-5', icon: Calculator },
                  { id: 'pilot', label: 'Pilot', desc: 'Numbers 1-9', icon: Rocket },
                  { id: 'commander', label: 'Commander', desc: 'Numbers 1-12', icon: Trophy },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setDifficulty(level.id as any)}
                    className={cn(
                      "w-full p-3 rounded-xl flex items-center gap-4 transition-all border",
                      difficulty === level.id 
                        ? "bg-white/10 border-white/30 text-white" 
                        : "bg-transparent border-transparent text-white/40 hover:bg-white/5"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      difficulty === level.id ? "bg-primary text-black" : "bg-white/10"
                    )}>
                      <level.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{level.label}</div>
                      <div className="text-xs opacity-70">{level.desc}</div>
                    </div>
                    {difficulty === level.id && <div className="ml-auto bg-white/20 px-2 py-1 rounded text-xs">Selected</div>}
                  </button>
                ))}
              </div>
            </div>

          </Card>


          {/* Right Column: Mode & Start */}
          <div className="flex flex-col gap-6">
            
            <Card className="bg-card/40 backdrop-blur-xl border-white/10 p-6 flex-1 flex flex-col justify-center space-y-6">
               <label className="text-sm uppercase tracking-wider text-blue-300 font-bold mb-2 block">Game Mode</label>
               
               <button 
                  onClick={() => setMode('practice')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left",
                    mode === 'practice'
                      ? "bg-green-500/20 border-green-500 text-white"
                      : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
                  )}
                >
                  <div className="p-3 bg-green-500 rounded-lg text-black">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Training Grounds</h3>
                    <p className="text-sm opacity-70">Practice at your own pace</p>
                  </div>
               </button>

               <button 
                  onClick={() => setMode('time-attack')}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left",
                    mode === 'time-attack'
                      ? "bg-orange-500/20 border-orange-500 text-white"
                      : "bg-white/5 border-transparent text-white/50 hover:bg-white/10"
                  )}
                >
                  <div className="p-3 bg-orange-500 rounded-lg text-black">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Time Attack</h3>
                    <p className="text-sm opacity-70">60 seconds to score high!</p>
                  </div>
               </button>
            </Card>

            <Link href={`/game?mode=${mode}&op=${operation}&diff=${difficulty}`}>
              <Button className="w-full h-20 text-2xl font-bold rounded-2xl bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 shadow-[0_0_25px_rgba(50,255,255,0.4)] border-none animate-pulse hover:animate-none active:scale-95 transition-transform">
                <Play className="mr-3 w-8 h-8 fill-current" />
                Launch Mission
              </Button>
            </Link>

          </div>

        </motion.div>
      </div>

      {/* Decorative Planet */}
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-800 to-blue-600 blur-3xl opacity-50 z-0 pointer-events-none" />
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-cyan-500 blur-[80px] opacity-30 z-0 pointer-events-none" />

    </div>
  );
}
