export type Operation = 'multiply' | 'divide';

export interface Problem {
  a: number;
  b: number;
  answer: number;
  operation: Operation;
  display: string;
}

export const generateProblem = (operation: Operation, selectedTables: number[]): Problem => {
  // Default to 1-12 if nothing selected (shouldn't happen with UI validation)
  const tables = selectedTables.length > 0 ? selectedTables : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  // Pick one number from the selected tables
  const a = tables[Math.floor(Math.random() * tables.length)];
  
  // Pick the second number randomly from 1 to 12
  const b = Math.floor(Math.random() * 12) + 1;

  // Randomize order for multiplication so it's not always "Table x Random"
  // e.g. 5x3 or 3x5
  const swap = Math.random() > 0.5;
  const first = swap ? b : a;
  const second = swap ? a : b;

  if (operation === 'multiply') {
    return {
      a: first,
      b: second,
      answer: first * second,
      operation,
      display: `${first} × ${second} = ?`
    };
  } else {
    // Division
    // Ensure integer result.
    // Problem: (a * b) / a = b
    // The "dividend" should be a multiple of one of the selected tables.
    
    // For division, "practicing the 5 times table" usually means dividing BY 5, 
    // or dividing a multiple OF 5.
    // Let's standardize: Dividend / Divisor = Quotient
    // We want the Divisor or Quotient to be in the selected tables.
    
    // Let's construct it:
    // a = one of selected tables (e.g. 5)
    // b = random 1-12 (e.g. 3)
    // product = 15
    // Display: 15 / 5 = ? (Answer: 3) 
    
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
