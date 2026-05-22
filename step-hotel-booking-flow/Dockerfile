FROM denoland/deno:latest AS builder

WORKDIR /app

COPY deno.json* deno.lock* ./

COPY . .

RUN deno cache main.ts
EXPOSE 8000


CMD ["deno", "-A", "main.ts"]