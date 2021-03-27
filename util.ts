import { BASE_URL } from "./common.ts";
import { Config, ConfigApiClient } from "./config.ts";
import { VRChatApiRepository } from "./repository.ts";

export async function getApiKey(): Promise<string> {
  const repository = new VRChatApiRepository(BASE_URL);
  const configClient = new ConfigApiClient(repository);
  const config = await configClient.getConfig() as Config;
  return config.clientApiKey;
}
