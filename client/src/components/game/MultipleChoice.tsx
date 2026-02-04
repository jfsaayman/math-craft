import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MultipleChoiceProps {
  options: number[];
  onSelect: (answer: number) => void;
  disabled?: boolean;
}

export function MultipleChoice({ options, onSelect, disabled }: MultipleChoiceProps) {
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

  // button style (same as Keypad)
  const mcButtonStyle = "relative active:top-1 border-b-4 border-black/50 active:border-b-0 bg-[#7c7c7c] hover:bg-[#8c8c8c] text-white font-display text-3xl shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.5),inset_2px_2px_0_rgba(255,255,255,0.2)] rounded-none";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto p-4 bg-[#c6c6c6] border-4 border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
    >
      {options.map((option, index) => (
        <motion.div key={`${option}-${index}`} variants={item}>
          <Button
            variant="ghost"
            className={cn(
              "w-full h-20 transition-none",
              mcButtonStyle
            )}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            {option}
          </Button>
        </motion.div>
      ))}
    </motion.div>
  );
}
