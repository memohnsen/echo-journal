import {
  audioProgress,
  recordingTimeMs,
  recordingTimeSeconds,
} from "../formatTime";

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
