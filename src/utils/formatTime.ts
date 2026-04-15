export const recordingTimeMs = (duration: number) => {
  const safe = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const totalSeconds = Math.floor(safe / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const recordingTimeSeconds = (duration: number) => {
  const safe = Number.isFinite(duration) ? Math.max(0, duration) : 0;
  const minutes = Math.floor(safe / 60);
  const seconds = Math.floor(safe % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const audioProgress = (current: number, duration: number) => {
  return duration > 0 ? Math.min(1, current / duration) : 0;
};

export const toDateTimestamp = (date: string): number => {
  const parsed = Date.parse(date);
  return Number.isNaN(parsed) ? 0 : parsed;
};
