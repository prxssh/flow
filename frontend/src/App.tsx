import { useState } from 'react';
import { Calculator as CalculatorIcon, Bot as BotIcon } from 'lucide-react';
import WasmCalculator from './WasmCalculator.tsx';
import Shader from './Shader.tsx';

type Tab = 'calculator' | 'shader';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('shader');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculator': return <WasmCalculator />;
      case 'shader': return <Shader />;
      default: return null;
    }
  };

  const TabButton = ({ tabName, icon, label }: { tabName: Tab; icon: JSX.Element; label: string }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${activeTab === tabName ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Rust + Elixir POC</h1>
          <p className="text-lg text-gray-400">React Frontend with Rust (WASM) and Elixir (Backend)</p>
        </header>
        <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex space-x-2 bg-gray-900/50 p-2 border-b border-gray-700">
            <TabButton tabName="calculator" icon={<CalculatorIcon size={18} />} label="Rust Calculator" />
            <TabButton tabName="shader" icon={<BotIcon size={18} />} label="Text-to-Shader" />
          </div>
          <div className="p-6 sm:p-8 min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>Elixir + Rust + React + WASM</p>
        </footer>
      </div>
    </div>
  );
}
