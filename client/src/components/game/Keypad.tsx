import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Delete, Check } from "lucide-react";
import { motion } from "framer-motion";

interface KeypadProps {
  onInput: (num: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function Keypad({ onInput, onDelete, onSubmit, disabled }: KeypadProps) {
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

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto p-4 bg-card/30 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl"
    >
      {numbers.map((num) => (
        <motion.div key={num} variants={item} className={num === 0 ? "col-start-2" : ""}>
          <Button
            variant="ghost"
            className={cn(
              "w-full h-20 text-3xl font-bold rounded-2xl transition-all duration-100",
              "bg-white/5 hover:bg-primary/20 hover:text-primary active:scale-95",
              "border-2 border-white/5 hover:border-primary/50"
            )}
            onClick={() => onInput(num)}
            disabled={disabled}
          >
            {num}
          </Button>
        </motion.div>
      ))}

      <motion.div variants={item} className="col-start-1 row-start-4">
        <Button
          variant="destructive"
          className="w-full h-20 rounded-2xl text-xl active:scale-95 transition-transform bg-destructive/80 hover:bg-destructive"
          onClick={onDelete}
          disabled={disabled}
        >
          <Delete className="w-8 h-8" />
        </Button>
      </motion.div>

      <motion.div variants={item} className="col-start-3 row-start-4">
        <Button
          className="w-full h-20 rounded-2xl text-xl active:scale-95 transition-transform bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={onSubmit}
          disabled={disabled}
        >
          <Check className="w-8 h-8" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
