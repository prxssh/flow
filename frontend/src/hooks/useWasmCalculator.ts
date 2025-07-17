import { useState, useEffect, useCallback } from 'react';
import init, { calculate as calculateWasm } from 'rust-calculator-lib';

interface UseWasmCalculatorReturn {
  isWasmReady: boolean;
  calculate: (expr: string) => string;
}

export default function useWasmCalculator(): UseWasmCalculatorReturn {
  const [isWasmReady, setIsWasmReady] = useState(false);

  useEffect(() => {
    init()
      .then(() => {
        setIsWasmReady(true);
        console.log("WASM module initialized successfully.");
      })
      .catch(err => {
        console.error("Error initializing WASM module:", err);
      });
  }, []);

  const calculate = useCallback((expr: string): string => {
    if (!isWasmReady) {
      return 'WASM not ready';
    }
    if (!expr.trim()) {
      return '';
    }
    try {
      return calculateWasm(expr);
    } catch (e) {
      console.error("Calculation error:", e);
      return 'Error';
    }
  }, [isWasmReady]);

  return { isWasmReady, calculate };
}
