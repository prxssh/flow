#############################################
#              WASM BUILDER                 #
#############################################
FROM rust:1.88.0-slim-bookworm AS wasm_builder

RUN cargo install wasm-pack --version 0.13.1

WORKDIR /app/rust-calculator-lib

COPY rust-calculator-lib/Cargo.toml rust-calculator-lib/Cargo.lock ./
COPY rust-calculator-lib/src ./src

RUN wasm-pack build --target web --out-dir pkg

#############################################
#              REACT BUILDER                #
#############################################
FROM node:20-alpine AS react_builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install && npm install -g serve

COPY . .
COPY --from=wasm_builder /app/rust-calculator-lib/pkg ./rust-calculator-lib/pkg

RUN npm run build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

