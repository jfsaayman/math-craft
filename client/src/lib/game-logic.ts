export type Operation = 'multiply' | 'divide';
export type Difficulty = 'cadet' | 'pilot' | 'commander';

export interface Problem {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
  display: string;
}

export const generateProblem = (operation: Operation, difficulty: Difficulty): Problem => {
  let min = 1;
  let max = 5;

  if (difficulty === 'pilot') max = 9;
  if (difficulty === 'commander') max = 12;

  // Ensure we don't just get 1x1 all the time, add some randomness weighting if needed
  // For now, simple random is fine for a 7yo.

  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;

  if (operation === 'multiply') {
    return {
      a,
      b,
      answer: a * b,
      operation,
      display: `${a} × ${b} = ?`
    };
  } else {
    // Division: Ensure integer result.
    // Create multiplication first: a * b = product.
    // Problem: product / a = b
    const product = a * b;
    return {
      a: product,
      b: a,
      answer: b,
      operation,
      display: `${product} ÷ ${a} = ?`
    };
  }
};
