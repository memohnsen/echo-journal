// duration is milliseconds
export const recordingTimeMs = (duration: number) => {
  const total = Math.floor((duration % 60000) / 1000);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// duration is seconds
export const recordingTimeSeconds = (duration: number) => {
  const total = Math.floor(duration % 60);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
