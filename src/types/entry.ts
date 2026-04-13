export interface Entry {
  mood: Mood;
  title: string;
  description?: string;
  topics?: string;
  date: string;
  audioURI?: string;
  duration?: string;
  transcript?: string;
}

export type Mood =
  | "excited"
  | "peaceful"
  | "neutral"
  | "sad"
  | "stressed"
  | "other";
