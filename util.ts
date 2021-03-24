export const BASE_URL = "https://vrchat.com/api/1/";

export function getAuthTokenFromEnv() {
  const authToken = Deno.env.get("VRC_API_AUTH_TOKEN");
  if (!authToken) {
    throw new Error("`$VRC_API_AUTH_TOKEN` is not exists.");
  }
  return authToken;
}
