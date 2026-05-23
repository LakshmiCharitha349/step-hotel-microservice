FROM denoland/deno:latest AS builder

WORKDIR /app

COPY deno.json* deno.lock* ./

COPY . .

RUN deno cache --reload main.ts

CMD ["deno", "-A", "main.ts"]