import { BASE_URL } from "./common.ts";
import { Repository } from "./repository.ts";
import { ConfigApi } from "./config.ts";

export async function getApiKey(): Promise<string> {
  const repository = new Repository(BASE_URL);
  const configClient = new ConfigApi(repository);
  const config = await configClient.getConfig();
  return config.clientApiKey;
}
