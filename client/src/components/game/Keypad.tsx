import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Delete } from "lucide-react";
import { motion } from "framer-motion";

interface KeypadProps {
  onInput: (num: number) => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function Keypad({ onInput, onDelete, disabled }: KeypadProps) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // button style helper
  const mcButtonStyle = "relative active:top-1 border-b-4 border-black/50 active:border-b-0 bg-[#7c7c7c] hover:bg-[#8c8c8c] text-white font-display text-2xl shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5),inset_2px_2px_0_rgba(255,255,255,0.2)] rounded-none";

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-2 w-full max-w-sm mx-auto p-4 bg-[#c6c6c6] border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
    >
      {numbers.map((num) => (
        <motion.div
          key={num}
          variants={item}
          className={num === 0 ? "col-start-2 row-start-4" : ""}
        >
          <Button
            variant="ghost"
            className={cn(
              "w-full h-16 transition-none", 
              mcButtonStyle
            )}
            onClick={() => onInput(num)}
            disabled={disabled}
          >
            {num}
          </Button>
        </motion.div>
      ))}

      <motion.div variants={item} className="col-start-1 col-span-3 row-start-5">
        <Button
          className={cn(
            "w-full h-16 transition-none bg-[#c85d5d] hover:bg-[#d36a6a] text-white text-xl flex items-center justify-center",
            mcButtonStyle
          )}
          onClick={onDelete}
          disabled={disabled}
        >
          <Delete className="w-6 h-6" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
