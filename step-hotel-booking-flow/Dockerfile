FROM denoland/deno:latest AS builder

WORKDIR /app

COPY deno.json* deno.lock* ./

COPY . .

RUN deno cache main.ts
EXPOSE 3000


CMD ["deno", "-A", "main.ts"]