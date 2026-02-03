export type Operation = 'multiply' | 'divide' | 'add' | 'subtract';

export interface Problem {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
  display: string;
}

export function generateChoices(correctAnswer: number): number[] {
  const distractors = new Set<number>();

  // Off-by-one errors
  distractors.add(correctAnswer + 1);
  distractors.add(correctAnswer - 1);

  // Off-by-small amounts (2-5)
  distractors.add(correctAnswer + Math.floor(Math.random() * 4) + 2);
  distractors.add(correctAnswer - Math.floor(Math.random() * 4) - 2);

  // Off-by-ten (place value confusion)
  if (correctAnswer >= 10) {
    distractors.add(correctAnswer + 10);
    distractors.add(correctAnswer - 10);
  }

  // Filter invalid (negative, zero, same as correct) and pick 3
  const valid = Array.from(distractors)
    .filter(d => d > 0 && d !== correctAnswer)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Combine with correct answer and shuffle
  return [...valid, correctAnswer].sort(() => Math.random() - 0.5);
}

export const generateProblem = (operation: Operation, selectedTables: number[]): Problem => {
  // Default to 1-12 if nothing selected (shouldn't happen with UI validation)
  const tables = selectedTables.length > 0 ? selectedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Pick one number from the selected tables
  const a = tables[Math.floor(Math.random() * tables.length)];
  
  // Pick the second number randomly from 1 to 12
  const b = Math.floor(Math.random() * 12) + 1;

  // RULE: For tables under 11, do not multiply by or divide by 11 or 12.
  // This means if 'a' is < 11, 'b' MUST be <= 10.
  // If 'a' >= 11, 'b' can be up to 12.
  let validB = b;
  if (a < 11) {
    // Force b to be max 10
    validB = Math.floor(Math.random() * 10) + 1;
  }

  // Randomize order for multiplication/addition so it's not always "Table x Random"
  // e.g. 5x3 or 3x5
  const swap = Math.random() > 0.5;
  const first = swap ? validB : a;
  const second = swap ? a : validB;

  if (operation === 'multiply') {
    return {
      a: first,
      b: second,
      answer: first * second,
      operation,
      display: `${first} × ${second} = ?`
    };
  } else if (operation === 'divide') {
    // Division
    // Ensure integer result.
    // Problem: (a * validB) / a = validB
    // a is the table we are practicing.
    
    // We want the divisor (a) or the quotient (validB) to be from the selected tables.
    // But typically "Divide by 5" means 5 is the divisor.
    
    // The previous logic was: product / a = validB
    // product = a * validB
    const product = a * validB;
    return {
      a: product,
      b: a,
      answer: validB,
      operation,
      display: `${product} ÷ ${a} = ?`
    };
  } else if (operation === 'add') {
    return {
        a: first,
        b: second,
        answer: first + second,
        operation,
        display: `${first} + ${second} = ?`
    };
  } else {
    // Subtract
    // Ensure positive result.
    // Problem: (a + validB) - a = validB
    const sum = a + validB;
    return {
        a: sum,
        b: a,
        answer: validB,
        operation,
        display: `${sum} - ${a} = ?`
    };
  }
};
