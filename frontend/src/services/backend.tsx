const URL_BACKEND_SERVICE = process.env.REACT_APP_URL_BACKEND_SERVICE

export interface ShaderAPIResponse {
  vertex: string;
  fragment: string;
  vertices: number;
}

export async function fetchShaderFromAPI(prompt: string): Promise<ShaderAPIResponse> {
  const response = await fetch(`${URL_BACKEND_SERVICE}/v1/shaders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: prompt }),
  });

  if (!response.ok) {
    throw new Error(`Backend error: ${response.statusText}`);
  }

  const body = await response.json();

  if (body.data && body.data.vertex && body.data.fragment && typeof body.data.vertices === 'number') {
    return body.data as ShaderAPIResponse;
  } else {
    throw new Error("Invalid response format from backend. Expected { data: { vertex, fragment, vertices } }.");
  }
}
