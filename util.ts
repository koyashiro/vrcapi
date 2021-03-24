export const BASE_URL = "https://vrchat.com/api/1/";

export enum Environment {
  ApiKey = "VRCAPI_API_KEY",
  AuthToken = "VRCAPI_AUTH_TOKEN",
}

export function getApiKeyFromEnv() {
  const authToken = Deno.env.get(Environment.ApiKey);
  if (!authToken) {
    throw new Error(`$\`$${Environment.ApiKey}\` is not exists.`);
  }
  return authToken;
}

export function getAuthTokenFromEnv() {
  const authToken = Deno.env.get(Environment.AuthToken);
  if (!authToken) {
    throw new Error(`$\`$${Environment.AuthToken}\` is not exists.`);
  }
  return authToken;
}
