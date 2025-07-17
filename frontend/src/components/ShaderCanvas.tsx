interface ShaderCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const ShaderCanvas: React.FC<ShaderCanvasProps> = ({ canvasRef }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Rendered Output</h3>
    <canvas ref={canvasRef} width="600" height="400" className="w-full h-auto bg-black rounded-md border border-gray-600"></canvas>
  </div>
);

export default ShaderCanvas;
