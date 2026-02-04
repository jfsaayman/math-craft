import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { USERS, setCurrentUser } from "@/lib/storage";

export default function UserSelection() {
  const [, setLocation] = useLocation();

  const handleSelect = (userId: string) => {
    setCurrentUser(userId);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-[url('/assets/background.png')] bg-cover bg-center font-body flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-2xl text-center"
      >
        <h1 className="text-4xl md:text-6xl text-white mb-12 drop-shadow-[4px_4px_0_#000000] font-display">
          WHO IS PLAYING?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {USERS.map((user) => (
            <motion.div
              key={user.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(user.id)}
              className="cursor-pointer"
            >
              <Card className="bg-[#c6c6c6] border-8 border-black p-6 rounded-none shadow-[12px_12px_0_#000000] hover:bg-[#d6d6d6] transition-colors">
                <div className="aspect-square w-full max-w-[200px] mx-auto mb-6 bg-white/20 border-4 border-black/10 p-2">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-full h-full object-contain pixelated" 
                  />
                </div>
                <h2 className="text-3xl font-display text-[#3f3f3f] uppercase">{user.name}</h2>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
