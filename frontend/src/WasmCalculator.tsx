import { useState, useEffect } from 'react';
import useWasmCalculator from './hooks/useWasmCalculator.ts';
import CalculatorInput from './components/CalculatorInput.tsx';
import CalculatorResultDisplay from './components/CalculatorResultDisplay.tsx';

export default function WasmCalculator() {
  const [expression, setExpression] = useState('(5 + 7) / 2 * 3');
  const [result, setResult] = useState('');
  const { isWasmReady, calculate } = useWasmCalculator();

  useEffect(() => {
    if (isWasmReady) {
      const calcResult = calculate(expression);
      setResult(calcResult);
    }
  }, [expression, isWasmReady, calculate]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Rust-Powered Calculator</h2>
      <p className="text-gray-400 mb-6">
        Enter a mathematical expression. The calculation is performed in real-time by a Rust
        (WebAssembly) module running in the browser.
      </p>
      
      <div className="space-y-4">
        <CalculatorInput expression={expression} setExpression={setExpression} />
        <CalculatorResultDisplay result={result} isWasmReady={isWasmReady} />
      </div>
    </div>
  );
}
