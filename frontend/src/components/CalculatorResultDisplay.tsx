interface CalculatorResultDisplayProps {
  result: string;
  isWasmReady: boolean;
}

const CalculatorResultDisplay: React.FC<ResultDisplayProps> = ({ result, isWasmReady }) => {
  const resultText = isWasmReady ? (result || '...') : 'WASM Loading...';
  const textColor = result === 'Error' ? 'text-red-500' : 'text-green-400';

  return (
    <div className="bg-gray-900 p-4 rounded-md text-right">
      <p className="text-gray-400 text-sm">Result</p>
      <p className={`text-3xl font-mono font-bold ${textColor}`}>
        {resultText}
      </p>
    </div>
  );
};

export default CalculatorResultDisplay;
