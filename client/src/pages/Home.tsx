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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             {/* Stats Container */}
             <div className="flex-1 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-4 items-center md:items-start">
               {/* Collection Card */}
               <Link href="/collection">
                 <Card className="bg-[#c6c6c6] border-4 border-black p-3 rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] w-full max-w-[200px] cursor-pointer hover:bg-[#d6d6d6] transition-colors">
                   <h3 className="font-display text-xs text-[#3f3f3f] uppercase mb-1">My Collection</h3>
                   <div className="flex items-center gap-2">
                      <Grid3X3 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm">{inventoryCount} Blocks</span>
                   </div>
                 </Card>
               </Link>

               {/* Overall Progress Card */}
               <Card className="bg-[#c6c6c6] border-4 border-black p-3 rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] w-full max-w-[200px]">
                 <h3 className="font-display text-xs text-[#3f3f3f] uppercase mb-1">Overall Stats</h3>
                 <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-[#5555ff]" />
                    <span className="font-bold text-sm">{overallStats.count} Games</span>
                 </div>
                 <div className="border-t border-black/20 pt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-[#3f3f3f]">
                    <div>×: {overallStats.breakdown?.multiply || 0}</div>
                    <div>÷: {overallStats.breakdown?.divide || 0}</div>
                    <div>+: {overallStats.breakdown?.add || 0}</div>
                    <div>-: {overallStats.breakdown?.subtract || 0}</div>
                 </div>
               </Card>
             </div>

             <div className="text-center flex-[2]">
               <h1 className="text-4xl md:text-6xl text-[#ffffff] drop-shadow-[4px_4px_0_#000000] tracking-wider leading-tight">
                 MATH CRAFT
               </h1>
               <p className="text-xl text-[#e0e0e0] drop-shadow-[2px_2px_0_#000000] bg-black/50 px-4 py-1 inline-block rounded-sm">
                 Build Your Brain Power!
               </p>
             </div>
             
             {/* Daily Stats Card */}
             <div className="flex-1 w-full md:w-auto flex justify-center md:justify-end">
               <Card className="bg-[#c6c6c6] border-4 border-black p-3 rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] w-full max-w-[200px]">
                 <h3 className="font-display text-xs text-[#3f3f3f] uppercase mb-1">Today's Progress</h3>
                 <div className="flex items-center gap-2 mb-1">
                    <div className="bg-[#55ff55] w-2 h-2 border border-black"></div>
                    <span className="font-bold text-sm">{todayStats.count} Games</span>
                 </div>
                 <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#5555ff] w-2 h-2 border border-black"></div>
                    <span className="font-bold text-sm">{todayStats.totalScore} Points</span>
                 </div>
                 
                 {/* Breakdown */}
                 <div className="border-t border-black/20 pt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-[#3f3f3f]">
                    <div>×: {todayStats.breakdown?.multiply || 0}</div>
                    <div>÷: {todayStats.breakdown?.divide || 0}</div>
                    <div>+: {todayStats.breakdown?.add || 0}</div>
                    <div>-: {todayStats.breakdown?.subtract || 0}</div>
                 </div>
               </Card>
             </div>
          </div>
        </motion.div>

        <div className="w-full grid lg:grid-cols-12 gap-6">
          
          {/* Left Column: Config */}
          <Card className="lg:col-span-8 bg-[#c6c6c6] border-4 border-black p-0 overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.5)] rounded-none">
            <div className="bg-[#8b8b8b] p-3 border-b-4 border-black flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 border-2 border-black" />
              <div className="w-4 h-4 bg-yellow-500 border-2 border-black" />
              <div className="w-4 h-4 bg-green-500 border-2 border-black" />
              <span className="ml-2 font-display text-white text-shadow-sm">Mission Setup</span>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Operation */}
              <div className="space-y-4">
                <label className="text-lg font-bold uppercase tracking-wider text-[#3f3f3f]">1. Choose Tools</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => toggleOperation('multiply')}
                    className={cn(
                      "p-4 border-4 transition-none flex items-center justify-center gap-3 active:translate-y-1 relative",
                      operations.includes('multiply') 
                        ? "bg-[#55ff55] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-3xl font-display">×</span>
                    <span className="font-bold text-lg uppercase">Multiply</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('divide')}
                    className={cn(
                      "p-4 border-4 transition-none flex items-center justify-center gap-3 active:translate-y-1 relative",
                      operations.includes('divide') 
                        ? "bg-[#55ffff] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-3xl font-display">÷</span>
                    <span className="font-bold text-lg uppercase">Divide</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('add')}
                    className={cn(
                      "p-4 border-4 transition-none flex items-center justify-center gap-3 active:translate-y-1 relative",
                      operations.includes('add') 
                        ? "bg-[#ffaa00] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-3xl font-display">+</span>
                    <span className="font-bold text-lg uppercase">Add</span>
                  </button>
                  <button 
                    onClick={() => toggleOperation('subtract')}
                    className={cn(
                      "p-4 border-4 transition-none flex items-center justify-center gap-3 active:translate-y-1 relative",
                      operations.includes('subtract') 
                        ? "bg-[#ff5555] border-black text-black shadow-[inset_-4px_-4px_0_rgba(0,0,0,0.2)]" 
                        : "bg-[#7c7c7c] border-black text-white hover:bg-[#8c8c8c] shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    )}
                  >
                    <span className="text-3xl font-display">-</span>
                    <span className="font-bold text-lg uppercase">Subtract</span>
                  </button>
                </div>
              </div>

              {/* Table Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-lg font-bold uppercase tracking-wider text-[#3f3f3f]">2. Select Tables</label>
                  <div className="flex gap-2 text-sm">
                    <button onClick={selectAll} className="text-blue-700 hover:underline font-bold uppercase">All</button>
                    <span className="text-gray-500">|</span>
                    <button onClick={clearAll} className="text-red-700 hover:underline font-bold uppercase">None</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => toggleTable(num)}
                      className={cn(
                        "aspect-square flex items-center justify-center font-display text-xl border-4 transition-none relative active:top-1",
                        selectedTables.includes(num)
                          ? "bg-white border-black text-black shadow-[inset_-3px_-3px_0_#cccccc]"
                          : "bg-[#555555] border-black text-[#aaaaaa] shadow-[3px_3px_0_#000000]"
                      )}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {selectedTables.length === 0 && (
                  <p className="text-red-600 font-bold text-center animate-pulse">Select at least one table!</p>
                )}
              </div>
            </div>
          </Card>

          {/* Right Column: Launch */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card className="bg-[#c6c6c6] border-4 border-black p-0 overflow-hidden shadow-[8px_8px_0_rgba(0,0,0,0.5)] rounded-none flex-1 flex flex-col justify-center items-center text-center p-6">
               <Trophy className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]" />
               <h3 className="font-display text-xl text-[#3f3f3f] mb-2">Earn Blocks!</h3>
               <p className="font-body text-lg text-[#3f3f3f]/80">
                 Complete missions to unlock new blocks for your collection.
               </p>
            </Card>

            <Link href={`/game?mode=time-attack&ops=${operations.join(',')}&tables=${selectedTables.join(',')}`}>
              <Button 
                disabled={selectedTables.length === 0}
                className={cn(
                  "w-full py-8 h-auto text-3xl font-display uppercase tracking-widest border-4 border-black rounded-none shadow-[8px_8px_0_#000000] active:translate-y-2 active:shadow-none transition-all whitespace-normal leading-tight",
                  "bg-[#5555ff] hover:bg-[#6666ff] text-white"
                )}
              >
                Start Game
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
