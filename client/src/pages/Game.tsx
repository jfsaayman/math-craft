import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Zap } from "lucide-react";
import confetti from "canvas-confetti";
import { Keypad } from "@/components/game/Keypad";
import { MultipleChoice } from "@/components/game/MultipleChoice";
import {
  generateProblem,
  generateChoices,
  type Operation,
  type Problem,
} from "@/lib/game-logic";
import { cn } from "@/lib/utils";
import {
  AVAILABLE_BLOCKS,
  recordGameComplete,
  recordBlockCollected,
} from "@/lib/storage";

export default function Game() {
  const [location, setLocation] = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const mode = "time-attack"; // Always time-attack/challenge now

  // Parse ops from URL
  const opsParam = searchParams.get("ops");
  const ops = (opsParam ? opsParam.split(",") : ["multiply"]) as Operation[];

  const tablesParam = searchParams.get("tables");
  const tables = tablesParam
    ? tablesParam.split(",").map(Number)
    : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [choices, setChoices] = useState<number[] | null>(null);

  const isMultipleChoice = questionCount % 2 === 0 && questionCount > 0;
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<"playing" | "finished" | "reward">(
    "playing",
  );
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">(
    "none",
  );
  const [streak, setStreak] = useState(0);

  // Reward State
  const [rewardOptions, setRewardOptions] = useState<typeof AVAILABLE_BLOCKS>(
    [],
  );
  const [selectedReward, setSelectedReward] = useState<
    (typeof AVAILABLE_BLOCKS)[0] | null
  >(null);

  useEffect(() => {
    nextProblem();
  }, []);

  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
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
  }, [gameState, timeLeft]);

  const nextProblem = () => {
    // Pick random operation from selected list
    const randomOp = ops[Math.floor(Math.random() * ops.length)];
    const newProblem = generateProblem(randomOp, tables);
    setProblem(newProblem);
    setInput("");
    setFeedback("none");

    // Increment question count and generate choices for even questions (2, 4, 6...)
    setQuestionCount((prev) => {
      const next = prev + 1;
      if (next % 2 === 0) {
        setChoices(generateChoices(newProblem.answer));
      } else {
        setChoices(null);
      }
      return next;
    });
  };

  const finishGame = () => {
    // Generate 3 random reward options
    const shuffled = [...AVAILABLE_BLOCKS].sort(() => 0.5 - Math.random());
    setRewardOptions(shuffled.slice(0, 3));

    setGameState("finished");

    // Construct readable name
    const opNames = ops.map((o) => {
      if (o === "multiply") return "×";
      if (o === "divide") return "÷";
      if (o === "add") return "+";
      if (o === "subtract") return "-";
      return o;
    });

    recordGameComplete(score);

    if (score > 0) {
      confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#55ff55", "#55ffff", "#ff5555", "#ffffff"],
        shapes: ["square"],
      });
    }
  };

  const handleSelectReward = (block: (typeof AVAILABLE_BLOCKS)[0]) => {
    recordBlockCollected(block.type);
    setSelectedReward(block);
    setGameState("reward");
    confetti({
      particleCount: 100,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#FFD700", "#FFFFFF"],
    });
  };

  const handleInput = (num: number) => {
    if (feedback !== "none") return;
    if (!problem) return;
    if (input.length >= 3) return;

    const nextInput = input + num.toString();
    setInput(nextInput);

    const expectedLength = String(problem.answer).length;
    if (nextInput.length >= expectedLength) {
      handleSubmitValue(nextInput);
    }
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1));
  };

  const handleSubmitValue = (value: string) => {
    if (!problem || !value) return;

    const val = parseInt(value);
    if (val === problem.answer) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setFeedback("correct");
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#55ff55", "#ffffff"],
        shapes: ["square"],
      });
      setTimeout(nextProblem, 600);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => {
        setInput("");
        setFeedback("none");
      }, 500);
    }
  };


  const handleMultipleChoiceSelect = (answer: number) => {
    if (!problem) return;

    if (answer === problem.answer) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => s + 1);
      setFeedback("correct");
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#55ff55", "#ffffff"],
        shapes: ["square"],
      });
      setTimeout(nextProblem, 600);
    } else {
      setFeedback("wrong");
      setStreak(0);
      setTimeout(() => {
        setFeedback("none");
      }, 500);
    }
  };

  if (gameState === "finished" || gameState === "reward") {
    return (
      <div className="min-h-screen bg-[url('/assets/background.png')] bg-cover bg-center flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60" />
        <Card className="max-w-2xl w-full bg-[#c6c6c6] border-4 border-black p-0 rounded-none relative z-10 shadow-[10px_10px_0_#000000]">
          <div className="bg-[#8b8b8b] p-3 border-b-4 border-black text-center">
            <h2 className="text-white font-display text-lg">Mission Report</h2>
          </div>

          <div className="p-8 text-center space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
            {/* Score Summary */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="text-xl font-display text-[#3f3f3f] uppercase">
                Total Score
              </div>
              <div className="text-6xl font-display text-[#5555ff] drop-shadow-[2px_2px_0_#000000]">
                {score}
              </div>
            </motion.div>

            {/* Reward Section */}
            {gameState === "finished" && (
              <div className="bg-black/10 p-6 border-4 border-black/20 rounded-lg">
                <h3 className="font-display text-[#3f3f3f] mb-4 text-xl">
                  Choose Your Reward!
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {rewardOptions.map((block) => (
                    <motion.button
                      key={block.type}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectReward(block)}
                      className="bg-black/20 p-4 border-4 border-black/40 hover:border-black hover:bg-white/20 flex flex-col items-center gap-3 transition-colors"
                    >
                      <img
                        src={block.src}
                        alt={block.name}
                        className="w-16 h-16 drop-shadow-lg pixelated"
                      />
                      <span className="font-display text-sm text-[#3f3f3f]">
                        {block.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {gameState === "reward" && selectedReward && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="bg-[#55ff55]/30 p-6 border-4 border-[#55ff55] rounded-lg"
              >
                <h3 className="font-display text-[#006600] mb-2 text-xl">
                  Block Collected!
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/50 blur-xl rounded-full animate-pulse"></div>
                    <img
                      src={selectedReward.src}
                      alt={selectedReward.name}
                      className="w-24 h-24 relative z-10 drop-shadow-2xl pixelated"
                    />
                  </div>
                  <span className="font-display text-2xl text-[#3f3f3f]">
                    {selectedReward.name}
                  </span>
                </div>
              </motion.div>
            )}

            {/* High Score Entry */}
            {/* Removed per request */}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
              <Button
                size="lg"
                className="h-16 flex-1 text-xl font-display bg-[#55ff55] hover:bg-[#66ff66] text-black border-4 border-black rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none"
                onClick={() => window.location.reload()}
              >
                Play Again
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-1 text-xl font-display bg-[#c6c6c6] hover:bg-[#d6d6d6] text-[#3f3f3f] border-4 border-[#3f3f3f] rounded-none shadow-[4px_4px_0_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Base
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/assets/background.png')] bg-cover bg-center flex flex-col items-center p-4 font-body">
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8 relative z-10">
        <Link href="/">
          <Button className="bg-[#c6c6c6] hover:bg-[#d6d6d6] border-4 border-black text-black rounded-none shadow-[4px_4px_0_#000000] h-12 w-12 p-0">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>

        <div className="flex items-center gap-4 bg-[#000000]/60 p-2 border-4 border-white/20 backdrop-blur-sm rounded-none">
          <div className="flex items-center gap-2 px-3">
            <span className="text-yellow-400 font-display text-sm">SCORE</span>
            <span className="text-2xl font-display text-white">{score}</span>
          </div>

          <div className="flex items-center gap-2 px-3 border-l-4 border-white/20">
            <Clock className="text-white w-5 h-5" />
            <span
              className={`text-2xl font-display ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-white"}`}
            >
              {timeLeft}
            </span>
          </div>

          {streak > 2 && (
            <div className="flex items-center gap-1 px-3 border-l-4 border-white/20 text-orange-400 animate-pulse">
              <Zap className="fill-current w-5 h-5" />
              <span className="font-display">x{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 w-full max-w-md flex flex-col justify-center gap-8 relative z-10">
        {/* Problem Sign */}
        <div className="relative mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={problem?.display}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                x: feedback === "wrong" ? [0, -10, 10, -10, 10, 0] : 0,
              }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={cn(
                "bg-[#c6c6c6] border-[6px] rounded-none p-8 text-center shadow-[10px_10px_0_rgba(0,0,0,0.6)] relative z-10 mt-8",
                feedback === "correct" ? "border-[#55ff55]" : "border-black",
                feedback === "wrong" ? "border-[#ff5555]" : "",
              )}
            >
              {/* Wooden Sign visual inside */}
              <div className="bg-[#a0522d] border-4 border-[#6d371e] p-6 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] relative">
                {/* Nail details */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-[#4a2615] rounded-full opacity-50" />
                <div className="absolute top-2 right-2 w-2 h-2 bg-[#4a2615] rounded-full opacity-50" />
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#4a2615] rounded-full opacity-50" />
                <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#4a2615] rounded-full opacity-50" />

                <div className="text-5xl md:text-6xl font-readable font-bold text-white tracking-widest drop-shadow-[3px_3px_0_#000000]">
                  {problem ? (
                    isMultipleChoice ? (
                      <span>{problem.display}</span>
                    ) : (
                      <div className="flex items-center justify-center gap-4">
                        <span>{problem.display.split("?")[0]}</span>
                        <span
                          className={cn(
                            "bg-black/30 min-w-[1.5em] px-2 border-b-4",
                            input
                              ? "border-white"
                              : "border-white/20 animate-pulse",
                          )}
                        >
                          {input || "?"}
                        </span>
                      </div>
                    )
                  ) : (
                    "..."
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Input Area: Multiple Choice or Keypad */}
        {isMultipleChoice && choices ? (
          <MultipleChoice
            options={choices}
            onSelect={handleMultipleChoiceSelect}
            disabled={feedback !== "none"}
          />
        ) : (
          <Keypad
            onInput={handleInput}
            onDelete={handleDelete}
            disabled={feedback !== "none"}
          />
        )}
      </div>
    </div>
  );
}
