/**
 * Builds absolute URLs for Expo Router API routes (`/api/chat`, `/api/transcribe`, …) from the React Native app. The dev server serves both the bundle and `+api` routes on one origin; this file figures out that origin in dev so `fetch` hits the right host (device/simulator, not `localhost` blindly).
 *
 * `generateAPIUrl("/api/chat")` → e.g. `http://192.168.1.10:8081/api/chat`
 *
 * Development resolution order:
 * 1. `EXPO_PUBLIC_API_BASE_URL` if set (recommended for real devices)
 * 2. `Constants.experienceUrl` (Expo Go), `exp://` rewritten to `http://`
 * 3. `Constants.expoConfig?.hostUri` (Metro host), with `http://` added if missing
 *
 * Production / non-development builds require `EXPO_PUBLIC_API_BASE_URL` to your deployed API origin.
 */
import Constants from "expo-constants";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function resolveDevOrigin(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (fromEnv) {
    return stripTrailingSlash(fromEnv);
  }

  const experience = Constants.experienceUrl;
  if (experience) {
    return stripTrailingSlash(experience.replace("exp://", "http://"));
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const withScheme =
      hostUri.startsWith("http://") || hostUri.startsWith("https://")
        ? hostUri
        : `http://${hostUri}`;
    return stripTrailingSlash(withScheme);
  }

  throw new Error(
    "Could not resolve the API origin. Set EXPO_PUBLIC_API_BASE_URL in .env.",
  );
}

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === "development") {
    return resolveDevOrigin().concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error(
      "EXPO_PUBLIC_API_BASE_URL environment variable is not defined",
    );
  }

  return stripTrailingSlash(process.env.EXPO_PUBLIC_API_BASE_URL).concat(path);
};
