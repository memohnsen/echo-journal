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
