import { createClient } from 'redis';

const client = createClient({
  url: Deno.env.get("REDIS_URL") || 'redis://localhost:6380'
});

await client.connect();

while (true) {
  const res = await client.blPop('pdf-generation', 1);

  const delay = (time: number) => new Promise(resolve => setTimeout(resolve, time));
  if (res?.element.startsWith("update-status")) {
    const id = res.element.split("-")[2]
    await delay(10000);
    const URL = Deno.env.get("UPDATESTATUS_URL");
    await fetch(`${URL}${id}`, { method: "PUT" });
  }
}

