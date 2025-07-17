interface ShaderCodeDisplayProps {
  vertexCode: string;
  fragmentCode: string;
  error: string;
}

const ShaderCodeDisplay: React.FC<ShaderCodeDisplayProps> = ({ vertexCode, fragmentCode, error }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Generated GLSL Code</h3>
    <div className="bg-gray-900 p-4 rounded-md h-[400px] overflow-auto font-mono text-sm border border-gray-600">
      {error && <pre className="text-red-400 whitespace-pre-wrap mb-4">{error}</pre>}
      <h4 className="text-gray-400 font-bold">Vertex Shader:</h4>
      <pre className="text-gray-300 whitespace-pre-wrap mb-4">{vertexCode || "// Vertex code will appear here..."}</pre>
      <hr className="border-gray-700 my-2" />
      <h4 className="text-gray-400 font-bold">Fragment Shader:</h4>
      <pre className="text-gray-300 whitespace-pre-wrap">{fragmentCode || "// Fragment code will appear here..."}</pre>
    </div>
  </div>
);

export default ShaderCodeDisplay;
