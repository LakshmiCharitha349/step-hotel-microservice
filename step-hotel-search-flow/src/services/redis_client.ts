import { createClient } from 'redis';
const client = createClient({
  url: Deno.env.get("REDIS_URL") || 'redis://localhost:6379'
});

await client.connect();

export const setValueToRedis = async (key: string, value: string) =>
  await client.set(key, value, { EX: 3600 })

export const getValue = async (key: string) => await client.get(key);

export const deleteValue = async (key: string) => await client.del(key);