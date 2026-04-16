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

const parseLocaleDateString = (date: string): number | null => {
  const trimmed = date.trim();

  const slash = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const a = Number(slash[1]);
    const b = Number(slash[2]);
    const year = Number(slash[3]);
    let month: number;
    let day: number;
    if (a > 12) {
      day = a;
      month = b;
    } else if (b > 12) {
      month = a;
      day = b;
    } else {
      month = a;
      day = b;
    }
    const t = new Date(year, month - 1, day).getTime();
    return Number.isNaN(t) ? null : t;
  }

  const dmyDots = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dmyDots) {
    const day = Number(dmyDots[1]);
    const month = Number(dmyDots[2]);
    const year = Number(dmyDots[3]);
    const t = new Date(year, month - 1, day).getTime();
    return Number.isNaN(t) ? null : t;
  }

  const isoDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDate) {
    const year = Number(isoDate[1]);
    const month = Number(isoDate[2]);
    const day = Number(isoDate[3]);
    const t = new Date(year, month - 1, day).getTime();
    return Number.isNaN(t) ? null : t;
  }

  return null;
};

export const toDateTimestamp = (date: string): number => {
  const parsed = Date.parse(date);
  if (!Number.isNaN(parsed)) {
    return parsed;
  }
  const fallback = parseLocaleDateString(date);
  return fallback ?? 0;
};
