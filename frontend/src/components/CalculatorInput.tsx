interface CalculatorInputProps {
  expression: string;
  setExpression: (value: string) => void;
}

const CalculatorInput: React.FC<CalculatorInputProps> = ({ expression, setExpression }) => (
  <input
    type="text"
    value={expression}
    onChange={(e) => setExpression(e.target.value)}
    placeholder="e.g., 2+2, 3*4, (5+7)/2"
    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    autoFocus
  />
);

export default CalculatorInput;
