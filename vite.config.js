import { Buffer } from "node:buffer";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

function fallbackTrack() {
  return {
    connected: false,
    isPlaying: false,
    title: "Spotify signal pending",
    artist: "Connect account to show live listening",
    album: "Now Playing",
    albumArt: "",
    spotifyUrl: "",
  };
}

function serializeTrack(data) {
  if (!data?.item) {
    return {
      connected: true,
      isPlaying: false,
      title: "Nothing playing right now",
      artist: "Spotify is quiet",
      album: "Now Playing",
      albumArt: "",
      spotifyUrl: "",
    };
  }

  return {
    connected: true,
    isPlaying: Boolean(data.is_playing),
    title: data.item.name,
    artist: data.item.artists?.map((artist) => artist.name).join(", ") || "",
    album: data.item.album?.name || "",
    albumArt: data.item.album?.images?.[0]?.url || "",
    spotifyUrl: data.item.external_urls?.spotify || "",
  };
}

async function getSpotifyAccessToken(env) {
  if (
    !env.SPOTIFY_CLIENT_ID ||
    !env.SPOTIFY_CLIENT_SECRET ||
    !env.SPOTIFY_REFRESH_TOKEN
  ) {
    return null;
  }

  const basicAuth = Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: env.SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) return null;

  const tokenData = await response.json();
  return tokenData.access_token;
}

function spotifyDevApi(env) {
  return {
    name: "spotify-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/spotify/now-playing", async (_request, response) => {
        const accessToken = await getSpotifyAccessToken(env);

        response.setHeader("Content-Type", "application/json");

        if (!accessToken) {
          response.end(JSON.stringify(fallbackTrack()));
          return;
        }

        const spotifyResponse = await fetch(NOW_PLAYING_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (spotifyResponse.status === 204) {
          response.end(JSON.stringify(serializeTrack(null)));
          return;
        }

        if (!spotifyResponse.ok) {
          response.end(JSON.stringify(fallbackTrack()));
          return;
        }

        const data = await spotifyResponse.json();
        response.end(JSON.stringify(serializeTrack(data)));
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [vue(), spotifyDevApi(env)],
  };
});
