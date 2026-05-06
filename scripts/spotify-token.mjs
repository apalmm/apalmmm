import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnvFile() {
  const envPath = resolve(".env.local");
  const raw = readFileSync(envPath, "utf8");
  const entries = raw
    .split("\n")
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => line.split(/=(.*)/s).slice(0, 2));

  return { envPath, raw, values: Object.fromEntries(entries) };
}

const code = process.argv[2];

if (!code) {
  throw new Error("Usage: npm run spotify:token -- <code-from-callback-url>");
}

const { envPath, raw, values } = readEnvFile();
const clientId = values.SPOTIFY_CLIENT_ID;
const clientSecret = values.SPOTIFY_CLIENT_SECRET;
const redirectUri =
  values.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";

if (!clientId || !clientSecret) {
  throw new Error("Missing Spotify client ID or client secret in .env.local");
}

const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const response = await fetch("https://accounts.spotify.com/api/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basicAuth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
  }),
});

const data = await response.json();

if (!response.ok) {
  throw new Error(data.error_description || data.error || "Token exchange failed");
}

if (!data.refresh_token) {
  throw new Error("Spotify did not return a refresh token");
}

const nextEnv = raw.includes("SPOTIFY_REFRESH_TOKEN=")
  ? raw.replace(/SPOTIFY_REFRESH_TOKEN=.*/g, `SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`)
  : `${raw.trim()}\nSPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`;

writeFileSync(envPath, nextEnv.endsWith("\n") ? nextEnv : `${nextEnv}\n`);

console.log("Saved SPOTIFY_REFRESH_TOKEN to .env.local");
