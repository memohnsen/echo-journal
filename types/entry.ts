export interface Entry {
  mood: Mood;
  title: string;
  description?: string;
  topics?: string[];
}

export type Mood =
  | "excited"
  | "peaceful"
  | "neutral"
  | "sad"
  | "stressed"
  | "other";
