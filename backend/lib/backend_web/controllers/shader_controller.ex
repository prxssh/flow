defmodule BackendWeb.ShaderController do
  use BackendWeb, :controller

  alias Backend.Shader

  @version "#{Application.spec(:backend, :vsn)}"

  @schema_generate_shader %{
    prompt: [type: :string, required: true]
  }

  @spec generate_shader(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def generate_shader(conn, params) do
    with {:ok, params} <- Tarams.cast(params, @schema_generate_shader),
         {:ok, shader_config} <- Shader.generate(params.prompt) do
      send_success_response(conn, shader_config)
    else
      {:error, reason} -> send_error_response(conn, reason)
    end
  end

  ########## Private

  @spec send_success_response(Plug.Conn.t(), Shader.config_t()) :: Plug.Conn.t()
  defp send_success_response(conn, shader_config) do
    conn
    |> put_status(:ok)
    |> json(%{success: true, version: @version, data: shader_config})
  end

  @spec send_error_response(Plug.Conn.t(), String.t() | :timeout) :: Plug.Conn.t()
  defp send_error_response(conn, error) do
    {status_code, message} =
      if error == :timeout, do: {504, "Request Timeout!"}, else: {500, error}

    conn
    |> put_status(status_code)
    |> json(%{success: false, version: @version, message: message})
  end
end
