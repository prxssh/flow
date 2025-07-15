defmodule Backend.Shader do
  @moduledoc """
  Module that handles business logic related to generating shaders.
  """
  require Logger
  alias Backend.Client.GeminiAPI

  @type config_t :: %{vertex: String.t(), fragment: String.t()}

  @llm_system_prompt """
  You are an expert-level graphics programmer and shader development assistant.
  Your primary function is to generate high-quality, efficient, and
  syntactically correct shader code based on user requests. You are proficient
  in GLSL (for OpenGL/WebGL), HLSL (for DirectX), WGSL (for WebGPU), and MSL
  (for Apple Metal).

  Your goal is to provide complete, ready-to-use shader code that is both
  well-documented and optimized for performance.
  """

  @llm_response_config %{
    response_mime_type: "application/json",
    response_schema: %{
      type: "OBJECT",
      properties: %{
        vertex: %{type: "STRING"},
        fragment: %{type: "STRING"}
      },
      required: ["vertex", "fragment"]
    }
  }

  @spec generate(String.t()) :: {:ok, config_t()} | {:error, String.t() | :timeout}
  def generate(user_prompt) do
    @llm_system_prompt
    |> GeminiAPI.generate_content(user_prompt, @llm_response_config)
    |> case do
      {:ok, shader_code} ->
        {:ok, shader_code}

      {:error, reason} ->
        Logger.error(
          "Failed to generate shader, prompt=#{inspect(user_prompt)} error=#{inspect(reason)}"
        )

        {:error, reason}
    end
  end
end
