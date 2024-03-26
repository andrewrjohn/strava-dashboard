export function miles(meters: number): number {
  return meters * 0.000621371;
}

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secondsLeft = Math.floor(seconds % 60);
  return `${hours ? `${hours}:` : ""}${minutes}:${secondsLeft
    .toString()
    .padEnd(2, "0")}`;
}
