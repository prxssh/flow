defmodule Backend.Client.GeminiAPI do
  @moduledoc """
  Client for [Gemini API](https://ai.google.dev/gemini-api/docs).
  """

  @spec generate_content(String.t(), String.t(), map()) ::
          {:ok, map()} | {:error, String.t() | :timeout}
  def generate_content(system_prompt, user_prompt, config) do
    body = %{
      generation_config: config,
      contents: [%{parts: [%{text: user_prompt}]}],
      system_instruction: %{parts: [%{text: system_prompt}]}
    }

    client()
    |> Req.post(url: "/v1beta/models/gemini-2.5-flash:generateContent", json: body)
    |> case do
      {:ok, response} -> response.body |> parse_body() |> Jason.decode(keys: :atoms!)
      {:error, %Req.TransportError{reason: :timeout}} -> {:error, :timeout}
      {:error, reason} -> {:error, inspect(reason)}
    end
  end

  ########## Private

  @spec client() :: Req.Request.t()
  defp client do
    [base_url: url(), receive_timeout: :timer.seconds(60)]
    |> Req.new()
    |> Req.Request.put_header("x-goog-api-key", key())
  end

  defp url, do: Application.fetch_env!(:backend, :url_gemini_api)
  defp key, do: Application.fetch_env!(:backend, :key_gemini_api)

  defp parse_body(%{"candidates" => [%{"content" => %{"parts" => [%{"text" => res}]}}]}), do: res
  defp parse_body(body), do: body
end
