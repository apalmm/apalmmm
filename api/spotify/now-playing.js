const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";

function emptyTrack(status = 200) {
  return {
    status,
    body: {
      connected: false,
      isPlaying: false,
      title: "Spotify signal pending",
      artist: "Connect account to show live listening",
      album: "Now Playing",
      albumArt: "",
      spotifyUrl: "",
    },
  };
}

async function getAccessToken() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const tokenData = await response.json();
  return tokenData.access_token;
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

export default async function handler(request, response) {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    const fallback = emptyTrack();
    response.status(fallback.status).json(fallback.body);
    return;
  }

  const spotifyResponse = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (spotifyResponse.status === 204) {
    response.status(200).json(serializeTrack(null));
    return;
  }

  if (!spotifyResponse.ok) {
    const fallback = emptyTrack(spotifyResponse.status);
    response.status(200).json(fallback.body);
    return;
  }

  const data = await spotifyResponse.json();
  response.status(200).json(serializeTrack(data));
}
