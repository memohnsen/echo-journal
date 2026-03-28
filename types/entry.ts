export interface Entry {
  mood: "excited" | "peaceful" | "neutral" | "sad" | "stressed";
  title: string;
  description?: string;
  topics?: string[];
}
