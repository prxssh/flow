interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({ prompt, setPrompt, onSubmit, isLoading }) => (
  <form onSubmit={onSubmit} className="space-y-4 mb-6">
    <textarea
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="e.g., 'a swirling vortex of colors'"
      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-white text-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      type="submit"
      disabled={isLoading}
      className="w-full p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Generating...' : 'Generate Shader'}
    </button>
  </form>
);

export default PromptForm;
