import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvFile() {
  const envPath = resolve(".env.local");
  const entries = readFileSync(envPath, "utf8")
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/=(.*)/s).slice(0, 2));

  return Object.fromEntries(entries);
}

const env = readEnvFile();
const clientId = env.SPOTIFY_CLIENT_ID;
const redirectUri = env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";
const scope = "user-read-currently-playing";

if (!clientId) {
  throw new Error("Missing SPOTIFY_CLIENT_ID in .env.local");
}

const params = new URLSearchParams({
  client_id: clientId,
  response_type: "code",
  redirect_uri: redirectUri,
  scope,
});

console.log(`https://accounts.spotify.com/authorize?${params.toString()}`);
