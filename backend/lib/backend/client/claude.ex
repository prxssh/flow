defmodule Backend.Client.ClaudeAPI do
  @moduledoc false
  require Logger

  @spec generate_content(String.t(), String.t()) :: {:ok, map()} | {:error, String.t() | :timeout}
  def generate_content(system_prompt, user_prompt) do
    messages = [
    %{
      role: "user",
      content: user_prompt
    }]

    body = %{
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: messages,
      system: system_prompt,
      }


    client()
    |> Req.post(url: "/v1/messages", json: body)
    |> case do
      {:ok, response} -> response.body |> IO.inspect() |> parse_body()
      {:error, %Req.TransportError{reason: :timeout}} -> {:error, :timeout}
      {:error, reason} -> {:error, inspect(reason)}
    end
  end

  ########## Private

  @spec client() :: Req.Request.t()
  defp client do
    [base_url: url(), receive_timeout: :timer.seconds(60)]
    |> Req.new()
    |> Req.Request.put_header("x-api-key", key())
    |> Req.Request.put_header("anthropic-version", "2023-06-01")
  end

  defp url, do: Application.fetch_env!(:backend, :url_claude_api)
  defp key, do: Application.fetch_env!(:backend, :key_claude_api)

  defp parse_body(%{"content" => content}) do
    text = content |> List.first() |> Map.fetch!("text")
    
    # Extract JSON from markdown code blocks if present
    json_text = case Regex.run(~r/```json\n(.*?)\n```/s, text) do
      [_, json] -> json
      nil -> text
    end
    
    case Jason.decode(json_text) do
      {:ok, %{"vertex" => vertex, "fragment" => fragment, "vertices" => vertices}} ->
        {:ok, %{vertex: vertex, fragment: fragment, vertices: vertices}}
      {:ok, _} ->
        {:error, "Invalid JSON structure: missing required fields (vertex, fragment, vertices)"}
      {:error, reason} ->
        {:error, "Failed to parse JSON: #{inspect(reason)}"}
    end
  end
  
  defp parse_body(body), do: {:error, "Unexpected response format: #{inspect(body)}"}
end
