const controller = new AbortController();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processWithDelay(
  numbers: any[],
  delayTime: number,
  signal?: AbortSignal
): Promise<void> {
  // The function should handle empty arrays gracefully and return a resolved Promise immediately.
  if (numbers.length === 0) return Promise.resolve();

  const total = numbers.length;
  for (let i = 0; i < total; i++) {
    // Support cancellation of the ongoing process
    if (signal?.aborted) throw new Error("Aborted");

    const item = numbers[i];

    // The function should also handle invalid inputs (e.g., non-array, non-numeric values) by throwing a custom error.
    if (typeof item !== "number") {
      throw new Error("Only number is accepted!");
    }

    // The function should process each number in the array with a 1-second delay between each number.
    await delay(delayTime);

    // The function should print each number to the console when it is processed.
    console.log(item);

    // Implement progress tracking
    console.log(`Progress: ${i + 1} / ${total}`);
  }

  // The function should return a Promise that resolves when all numbers have been processed.
  return Promise.resolve();
}

// -------------------------
processWithDelay([1, 2, 3, "4", 5], 1000, controller.signal).catch((err) =>
  console.log(err.message)
);

// Cancel after 2,5s
setTimeout(() => {
  controller.abort();
}, 2500);
