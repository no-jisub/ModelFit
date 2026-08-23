import { preview } from "astro";

const server = await preview({
  root: process.cwd(),
  server: {
    host: "127.0.0.1",
    port: 4322,
  },
});

async function stop() {
  await server.stop();
  process.exit(0);
}

process.once("SIGINT", stop);
process.once("SIGTERM", stop);
