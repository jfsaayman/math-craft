import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getBlockCounts, AVAILABLE_BLOCKS } from "@/lib/storage";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Collection() {
  const [blockCounts, setBlockCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setBlockCounts(getBlockCounts());
  }, []);

  return (
    <div className="min-h-screen bg-[url('/assets/background.jpg')] bg-cover bg-center font-body flex flex-col items-center p-4">
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
           <Link href="/">
             <Button className="bg-[#c6c6c6] hover:bg-[#d6d6d6] border-4 border-black text-black rounded-none shadow-[4px_4px_0_#000000]">
               <ArrowLeft className="mr-2 w-6 h-6" /> Back
             </Button>
           </Link>
           <div className="bg-[#c6c6c6] border-4 border-black px-6 py-2 shadow-[4px_4px_0_#000000]">
             <h1 className="text-2xl font-display text-[#3f3f3f]">My Block Collection</h1>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {AVAILABLE_BLOCKS.map((block) => {
            const count = blockCounts[block.type] || 0;
            const isUnlocked = count > 0;
            
            return (
              <Card 
                key={block.type}
                className={cn(
                  "border-4 border-black p-4 rounded-none flex flex-col items-center gap-4 transition-all hover:scale-105",
                  isUnlocked ? "bg-[#c6c6c6] shadow-[6px_6px_0_rgba(0,0,0,0.5)]" : "bg-[#8b8b8b] opacity-80"
                )}
              >
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <img 
                    src={block.src} 
                    alt={block.name} 
                    className={cn(
                      "w-full h-full object-contain pixelated drop-shadow-lg",
                      !isUnlocked && "grayscale opacity-50 brightness-50"
                    )} 
                  />
                  {isUnlocked && (
                    <div className="absolute -bottom-2 -right-2 bg-[#55ff55] border-2 border-black px-2 font-display text-xs">
                      x{count}
                    </div>
                  )}
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                       <span className="text-4xl opacity-50">?</span>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h3 className="font-display text-sm text-[#3f3f3f] mb-1">{block.name}</h3>
                  <div className={cn(
                    "text-xs px-2 py-1 inline-block border border-black/20",
                    block.rarity === 'common' && "bg-gray-300",
                    block.rarity === 'rare' && "bg-yellow-200",
                    block.rarity === 'epic' && "bg-purple-300",
                    block.rarity === 'legendary' && "bg-blue-300",
                  )}>
                    {block.rarity.toUpperCase()}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {Object.keys(blockCounts).length === 0 && (
          <div className="bg-[#c6c6c6] border-4 border-black p-8 text-center mt-12">
            <p className="font-body text-xl text-[#3f3f3f]">You haven't collected any blocks yet!</p>
            <p className="text-black/60">Play games to earn rewards.</p>
          </div>
        )}

      </div>
    </div>
  );
}
