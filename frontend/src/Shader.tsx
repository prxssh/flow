import { useState } from 'react';
import PromptForm from './components/PromptForm.tsx';
import ShaderCanvas from './components/ShaderCanvas.tsx';
import ShaderCodeDisplay from './components/ShaderCodeDisplay.tsx';
import useWebGLRenderer from './hooks/useWebGLRenderer.tsx';
import { fetchShaderFromAPI } from './services/backend.tsx';

export default function Shader() {
  const [prompt, setPrompt] = useState('A rotating cube with a gradient background');
  const [shaderData, setShaderData] = useState<ShaderData>({ vertex: '', fragment: '', vertices: 6 });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { canvasRef, error: rendererError } = useWebGLRenderer(shaderData.vertex, shaderData.fragment, shaderData.vertices);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError('');
    setShaderData({ vertex: '', fragment: '', vertices: 6 });

    try {
      const data = await fetchShaderFromAPI(prompt);
      setShaderData({
        vertex: data.vertex,
        fragment: data.fragment,
        vertices: data.vertices,
      });
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = apiError || rendererError;

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">AI-Powered Text-to-Shader</h2>
      <p className="text-gray-400 mb-6">
        Describe a WebGL fragment shader. Your prompt will be sent to an Elixir backend, which uses an LLM to generate the code.
      </p>

      <PromptForm
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShaderCanvas canvasRef={canvasRef} />
        <ShaderCodeDisplay
          vertexCode={shaderData.vertex}
          fragmentCode={shaderData.fragment}
          error={displayError}
        />
      </div>
    </div>
  );
}
