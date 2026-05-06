export const emptySpotifyTrack = {
  connected: false,
  isPlaying: false,
  title: "Spotify signal pending",
  artist: "Connect account to show live listening",
  album: "Now Playing",
  albumArt: "",
  spotifyUrl: "",
};

export async function getNowPlaying() {
  const response = await fetch("/api/spotify/now-playing", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Spotify endpoint unavailable");
  }

  return response.json();
}
