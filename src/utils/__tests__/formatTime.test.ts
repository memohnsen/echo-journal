import {
  audioProgress,
  recordingTimeMs,
  recordingTimeSeconds,
  toDateTimestamp,
} from "../formatTime";

const localMidnight = (year: number, monthIndex: number, day: number) =>
  new Date(year, monthIndex, day).getTime();

// recordingTimeMs
describe("recordingTimeMs", () => {
  it("takes a duration in milliseconds and outputs text as m:ss", () => {
    expect(recordingTimeMs(120000)).toBe("2:00");
  });
});

describe("recordingTimeMs", () => {
  it("returns 0:00 when 0 is passed in", () => {
    expect(recordingTimeMs(0)).toBe("0:00");
  });
});

// recordingTimeSeconds
describe("recordingTimeSeconds", () => {
  it("takes a duration in seconds and outputs text as m:ss", () => {
    expect(recordingTimeSeconds(120)).toBe("2:00");
  });
});

describe("recordingTimeSeconds", () => {
  it("returns 0:00 when 0 is passed in", () => {
    expect(recordingTimeSeconds(0)).toBe("0:00");
  });
});

// audioProgress
describe("audioProgress", () => {
  it("takes the current audio time / total time and returns a progress from 0.0 to 1.0", () => {
    expect(audioProgress(60, 120)).toBe(0.5);
  });
});

describe("audioProgress", () => {
  it("returns 0.0 when 0 is passed in", () => {
    expect(audioProgress(0, 0)).toBe(0);
  });
});

describe("toDateTimestamp", () => {
  it("maps US-style M/D/YYYY to local calendar midnight ms", () => {
    expect(toDateTimestamp("4/15/2026")).toBe(localMidnight(2026, 3, 15));
    expect(toDateTimestamp("04/05/2026")).toBe(localMidnight(2026, 3, 5));
  });

  it("parses slash dates when the first field is the day (D/M/Y)", () => {
    expect(Date.parse("15/4/2026")).toBeNaN();
    expect(toDateTimestamp("15/4/2026")).toBe(localMidnight(2026, 3, 15));
  });

  it("parses slash dates when the second field is the day (M/D/Y)", () => {
    expect(toDateTimestamp("4/16/2026")).toBe(localMidnight(2026, 3, 16));
  });

  it("parses dotted D.M.YYYY (common EU-style) when Date.parse fails", () => {
    expect(Date.parse("16.4.2026")).toBeNaN();
    expect(toDateTimestamp("16.4.2026")).toBe(localMidnight(2026, 3, 16));
  });

  it("trims whitespace before applying locale fallbacks", () => {
    expect(Date.parse(" 15/4/2026 ")).toBeNaN();
    expect(toDateTimestamp(" 15/4/2026 ")).toBe(localMidnight(2026, 3, 15));
  });

  it("returns 0 when the string cannot be interpreted as a date", () => {
    expect(toDateTimestamp("")).toBe(0);
    expect(toDateTimestamp("not-a-date")).toBe(0);
  });
});
