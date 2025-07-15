defmodule BackendWeb.Router do
  use BackendWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug ProperCase.Plug.SnakeCaseParams
  end

  scope "/v1/shaders", BackendWeb do
    pipe_through :api

    post("/", ShaderController, :generate_shader)
  end
end
