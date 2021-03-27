import { BASE_URL } from "./common.ts";
import { Config, ConfigApiClient } from "./config.ts";
import { VRChatApiRepository } from "./repository.ts";

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

export async function getApiKey(): Promise<string> {
  const repository = new VRChatApiRepository(BASE_URL);
  const configClient = new ConfigApiClient(repository);
  const config = await configClient.getConfig() as Config;
  return config.clientApiKey;
}
