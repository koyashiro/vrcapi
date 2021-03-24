import { VRChatApiRepository } from "./repository.ts";
import { VRChatApiClient } from "./client.ts";
import { TwoFactorApiClient } from "./two_factor.ts";
import { BASE_URL } from "./util.ts";

export async function login(
  username: string,
  password: string,
  code?: string,
) {
  const repository = new VRChatApiRepository(BASE_URL, {
    basicCredential: { username, password },
  });
  const client = new VRChatApiClient(repository);

  const config = await client.config.getConfig();
  const apiKey = config.apiKey;

  const params = new Map<string, string | undefined>();
  params.set("apiKey", apiKey);

  const currentUser = await client.currentUser.getCurrentUser();

  if (currentUser.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require Two-Factor Authentication.");
    }

    const twoFactorApiClient = new TwoFactorApiClient(repository);
    const verify = await twoFactorApiClient.postVerify(code);
    if (!verify.verified) {
      throw new Error("Two-Factor Authentication error.");
    }
  }

  return client;
}

export const loginWithAuthToken = async (authToken: string) => {
  const repository = new VRChatApiRepository(BASE_URL);
  const client = new VRChatApiClient(repository);

  const config = await client.config.getConfig();
  const apiKey = config.apiKey;

  repository.authCredential = { apiKey, authToken };

  return client;
};
