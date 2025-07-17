import { useState, useEffect, useRef, useCallback } from 'react';

interface UseWebGLRendererReturn {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    error: string;
}

function useWebGLRenderer(vertexCode: string, fragmentCode: string, numVertices: number): UseWebGLRendererReturn {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const animationFrameRef = useRef<number>(0);
    const [error, setError] = useState('');

    const compileShader = useCallback((gl: WebGL2RenderingContext, source: string, type: number): WebGLShader | null => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          const info = gl.getShaderInfoLog(shader);
          const shaderType = type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment';

          setError(`${shaderType} Shader Compile Error: ${info}`);
          gl.deleteShader(shader);

          return null;
        }

        return shader;
    }, []);

    const animate = useCallback((time: number) => {
        if (!glRef.current || !programRef.current) return;

        const gl = glRef.current;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        const uTimeLocation = gl.getUniformLocation(programRef.current, "u_time");
        if(uTimeLocation) gl.uniform1f(uTimeLocation, time * 0.001);

        const uResolutionLocation = gl.getUniformLocation(programRef.current, "u_resolution");
        if(uResolutionLocation) gl.uniform2f(uResolutionLocation, gl.canvas.width, gl.canvas.height);

        gl.drawArrays(gl.TRIANGLES, 0, numVertices);
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [numVertices]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            glRef.current = canvas.getContext('webgl2');
            if (!glRef.current) {
                setError('WebGL 2.0 not supported. Please use a modern browser like Chrome or Firefox.');
            } else {
                glRef.current.clearColor(0.0, 0.0, 0.0, 1.0);
            }
        }
        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        }
    }, []);

    useEffect(() => {
        if (!glRef.current || !vertexCode || !fragmentCode) return;
        const gl = glRef.current;

        setError('');

        const vertexShader = compileShader(gl, vertexCode, gl.VERTEX_SHADER);
        const fragmentShader = compileShader(gl, fragmentCode, gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) return;

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          const info = gl.getProgramInfoLog(program);

          setError(`Program Link Error: ${info}`);
          return;
        }

        if (programRef.current) gl.deleteProgram(programRef.current);

        programRef.current = program;
        gl.useProgram(program);

        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = requestAnimationFrame(animate);

    }, [vertexCode, fragmentCode, numVertices, compileShader, animate])

    return { canvasRef, error };
}

export default useWebGLRenderer;
