import { createClient } from 'redis';
const client = createClient({
  url: Deno.env.get("REDIS_URL") || 'redis://localhost:6379'
});

await client.connect();

export const pushUpdateStatus = async (id: string) =>
  await client.rPush('pdf-generation', "update-status-" + id);
