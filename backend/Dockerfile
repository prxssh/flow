###############################################################
#                      BUILDER STAGE                          #
###############################################################
FROM hexpm/elixir:1.18.4-erlang-28.0.1-alpine-3.21.3 as builder

RUN apk add --no-cache build-base git

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY priv priv
COPY lib lib

RUN mix compile

COPY config/runtime.exs config/

COPY rel rel
RUN mix release

############################
#      RUNNER STAGE        #
############################
FROM alpine:3.21.3 as runner

RUN apk add --no-cache openssl ncurses-libs libgcc libstdc++

WORKDIR /app
RUN chown root:root /app

ENV MIX_ENV="prod"

COPY --from=builder --chown=root:root /app/_build/${MIX_ENV}/rel/backend ./

USER nobody

CMD ["/app/bin/server"]
