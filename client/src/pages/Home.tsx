import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Rocket, Zap, CheckSquare, Trophy, Grid3X3, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTodayStats, getOverallStats, getInventory, AVAILABLE_BLOCKS } from "@/lib/storage";
import { type Operation } from "@/lib/game-logic";

export default function Home() {
  const [selectedTables, setSelectedTables] = useState<number[]>([2, 5, 10]); 
  const [operations, setOperations] = useState<Operation[]>(['multiply']);
  const [todayStats, setTodayStats] = useState(getTodayStats());
  const [overallStats, setOverallStats] = useState(getOverallStats());
  const [inventoryCount, setInventoryCount] = useState(0);

  useEffect(() => {
    setTodayStats(getTodayStats());
    setOverallStats(getOverallStats());
    setInventoryCount(getInventory().length);
  }, []);

  const toggleTable = (num: number) => {
    setSelectedTables(prev => 
      prev.includes(num) 
        ? prev.filter(n => n !== num)
        : [...prev, num].sort((a, b) => a - b)
    );
  };

  const toggleOperation = (op: Operation) => {
    setOperations(prev => {
        if (prev.includes(op)) {
            // Don't allow unselecting the last one
            if (prev.length === 1) return prev;
            return prev.filter(o => o !== op);
        }
        return [...prev, op];
    });
  };

  const selectAll = () => setSelectedTables([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const clearAll = () => setSelectedTables([]);

  return (
    <div className="min-h-screen bg-[url('/assets/minecraft-bg.png')] bg-cover bg-center font-body flex flex-col items-center">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" /> 
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center min-h-screen max-w-5xl">
        
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8 space-y-4 w-full"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
             <div className="text-center">
               <h1 className="text-4xl md:text-6xl text-[#ffffff] drop-shadow-[4px_4px_0_#000000] tracking-wider leading-tight">
                 MATH CRAFT
               </h1>
               <p className="text-xl text-[#e0e0e0] drop-shadow-[2px_2px_0_#000000] bg-black/50 px-4 py-1 inline-block rounded-sm">
                 Build Your Brain Power!
               </p>
             </div>
          </div>
        </motion.div>

        {/* My Blocks - Now at the Top */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full mb-6"
        >
          <Link href="/collection" className="block">
            <Card className="bg-[#c6c6c6] border-4 border-black p-4 rounded-none shadow-[8px_8px_0_rgba(0,0,0,0.5)] cursor-pointer hover:bg-[#d6d6d6] transition-colors flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Grid3X3 className="w-8 h-8 text-blue-600" />
                <span className="font-display text-lg text-[#3f3f3f] uppercase">My Blocks Collection</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-blue-700">{inventoryCount}</span>
                <span className="font-display text-xs text-[#3f3f3f] opacity-60">UNLOCKED</span>
              </div>
            </Card>
          </Link>
        </motion.div>

        {/* Hall of Fame Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full mb-6"
        >
          <Card className="bg-[#c6c6c6] border-4 border-black p-0 shadow-[8px_8px_0_rgba(0,0,0,0.5)] rounded-none overflow-hidden">
            <div className="bg-[#8b8b8b] p-3 border-b-4 border-black flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-white" />
              <span className="font-display text-white text-shadow-sm uppercase">Hall of Fame Stats</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Total Games */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/20 border-4 border-black/10">
                <span className="font-display text-xs text-[#3f3f3f] mb-2 uppercase">Total Missions</span>
                <span className="font-display text-4xl text-blue-700 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
                  {overallStats.count}
                </span>
              </div>

              {/* Total XP */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/20 border-4 border-black/10">
                <span className="font-display text-xs text-[#3f3f3f] mb-2 uppercase">Total XP</span>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-500 fill-orange-500" />
                  <span className="font-display text-4xl text-orange-700 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
                    {overallStats.totalScore.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">×</span>
                  <span className="font-display text-lg">{overallStats.breakdown?.multiply || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">÷</span>
                  <span className="font-display text-lg">{overallStats.breakdown?.divide || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">+</span>
                  <span className="font-display text-lg">{overallStats.breakdown?.add || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">-</span>
                  <span className="font-display text-lg">{overallStats.breakdown?.subtract || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Today's Progress */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full mb-8"
        >
          <Card className="bg-[#c6c6c6] border-4 border-black p-0 shadow-[8px_8px_0_rgba(0,0,0,0.5)] rounded-none overflow-hidden">
            <div className="bg-[#8b8b8b] p-3 border-b-4 border-black flex items-center gap-2">
              <Rocket className="w-5 h-5 text-white" />
              <span className="font-display text-white text-shadow-sm uppercase">Today's Progress</span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center justify-center p-4 bg-white/20 border-4 border-black/10">
                <span className="font-display text-xs text-[#3f3f3f] mb-2 uppercase">Today's Missions</span>
                <span className="font-display text-4xl text-green-700 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
                  {todayStats.count}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white/20 border-4 border-black/10">
                <span className="font-display text-xs text-[#3f3f3f] mb-2 uppercase">Today's XP</span>
                <span className="font-display text-4xl text-blue-700 drop-shadow-[2px_2px_0_rgba(255,255,255,0.5)]">
                  {todayStats.totalScore.toLocaleString()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">×</span>
                  <span className="font-display text-lg">{todayStats.breakdown?.multiply || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">÷</span>
                  <span className="font-display text-lg">{todayStats.breakdown?.divide || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">+</span>
                  <span className="font-display text-lg">{todayStats.breakdown?.add || 0}</span>
                </div>
                <div className="flex justify-between items-center bg-black/10 px-4 py-2 border-2 border-black/5">
                  <span className="font-display text-xl">-</span>
                  <span className="font-display text-lg">{todayStats.breakdown?.subtract || 0}</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mission Setup & Start Game */}
        <div className="w-full space-y-8">
          {/* Mission Setup */}
          <Card className="bg-[#c6c6c6] border-4 border-black p-0 overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.5)] rounded-none">
            <div className="bg-[#8b8b8b] p-3 border-b-4 border-black flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-white" />
              <span className="font-display text-white text-shadow-sm uppercase">Mission Setup</span>
            </div>
            
            <div className="p-6 grid md:grid-cols-2 gap-8">
              {/* Tools */}
              <div className="space-y-4">
                <label className="text-lg font-bold uppercase tracking-wider text-[#3f3f3f]">1. Choose Tools</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => toggleOperation('multiply')}
                    className={cn(
                      "p-3 border-4 flex items-center justify-center gap-2 active:translate-y-1 relative",
                      operations.includes('multiply') 
                        ? "bg-[#55ff55] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-2xl font-display">×</span>
                    <span className="font-bold text-sm uppercase">Multiply</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('divide')}
                    className={cn(
                      "p-3 border-4 flex items-center justify-center gap-2 active:translate-y-1 relative",
                      operations.includes('divide') 
                        ? "bg-[#55ffff] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-2xl font-display">÷</span>
                    <span className="font-bold text-sm uppercase">Divide</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('add')}
                    className={cn(
                      "p-3 border-4 flex items-center justify-center gap-2 active:translate-y-1 relative",
                      operations.includes('add') 
                        ? "bg-[#ffaa00] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-2xl font-display">+</span>
                    <span className="font-bold text-sm uppercase">Add</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('subtract')}
                    className={cn(
                      "p-3 border-4 flex items-center justify-center gap-2 active:translate-y-1 relative",
                      operations.includes('subtract') 
                        ? "bg-[#ff5555] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-2xl font-display">-</span>
                    <span className="font-bold text-sm uppercase">Subtract</span>
                  </button>
                </div>
              </div>

              {/* Tables */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-lg font-bold uppercase tracking-wider text-[#3f3f3f]">2. Select Tables</label>
                  <div className="flex gap-2 text-xs">
                    <button onClick={selectAll} className="text-blue-700 hover:underline font-bold uppercase">All</button>
                    <span className="text-gray-500">|</span>
                    <button onClick={clearAll} className="text-red-700 hover:underline font-bold uppercase">None</button>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => toggleTable(num)}
                      className={cn(
                        "aspect-square flex items-center justify-center font-display text-sm border-2 transition-none relative active:top-1",
                        selectedTables.includes(num)
                          ? "bg-white border-black text-black shadow-[inset_-2px_-2px_0_#cccccc]"
                          : "bg-[#555555] border-black text-[#aaaaaa] shadow-[2px_2px_0_#000000]"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Start Game Button */}
          <Link href={`/game?mode=time-attack&ops=${operations.join(',')}&tables=${selectedTables.join(',')}`}>
            <Button 
              disabled={selectedTables.length === 0}
              className={cn(
                "w-full py-10 h-auto text-4xl font-display uppercase tracking-widest border-4 border-black rounded-none shadow-[8px_8px_0_#000000] active:translate-y-2 active:shadow-none transition-all whitespace-normal leading-tight mb-12",
                "bg-[#5555ff] hover:bg-[#6666ff] text-white"
              )}
            >
              Start Game
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
