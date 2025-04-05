# Async Number Processor

This project demonstrates a TypeScript implementation of an asynchronous number processing function with configurable delays and cancellation support.

## Features

- ✨ Process numbers sequentially with configurable delay
- ✨ Promise-based async/await implementation
- ✨ Progress tracking for each processed number
- ✨ Graceful handling of empty arrays
- ✨ Input validation for non-numeric values
- ✨ Support for process cancellation using AbortController
- ✨ TypeScript for type safety

## Implementation Details

The main function `processWithDelay` takes three parameters:
- `numbers`: An array of numbers to process
- `delayTime`: Time in milliseconds to delay between processing each number
- `signal`: Optional AbortSignal for cancellation support

The function implements:
1. Input validation for non-numeric values
2. Empty array handling
3. Progress tracking
4. Configurable delays using Promise-based setTimeout
5. Cancellation support via AbortController

## Prerequisites

- Node.js (Latest LTS version recommended)
- TypeScript

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Code

To run the example:

```bash
npm start
```

This will:
1. Compile the TypeScript code
2. Run the compiled JavaScript

## Example Output

When running with `[1, 2, 3, "4", 5]` and cancellation after 2.5 seconds:

```
1
Progress: 1 / 5
2
Progress: 2 / 5
Aborted
```

## Error Handling

The implementation handles several error cases:
- Non-numeric values in the array throw "Only number is accepted!"
- Cancellation throws "Aborted"
- Empty arrays are handled gracefully 