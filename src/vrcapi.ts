import { VRChatApiRepository } from "./repositories/VRChatApiRepository.ts";
import { VRChatApiClient } from "./clients/VRChatApiClient.ts";
import { Verify } from "./interfaces/Verify.ts";
import { Config } from "./interfaces/Config.ts";
import { CurrentUser } from "./interfaces/CurrentUser.ts";

const baseUrl = "https://vrchat.com/api/1/";
const repository = new VRChatApiRepository(baseUrl);

const login = async (
  username: string,
  password: string,
  code?: string,
) => {
  const config = await repository.get<Config>("config");
  const apiKey = config.apiKey;

  const [currentUser, authToken] = await repository.getWithBasic<
    CurrentUser
  >(
    "auth/user",
    apiKey,
    username,
    password,
  );

  if (currentUser.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require Two-Factor Authentication.");
    }

    const verify = await repository.postWithAuthToken<Verify>(
      "auth/twofactorauth/totp/verify",
      apiKey,
      authToken,
      JSON.stringify({ code }),
    );
    if (!verify.verified) {
      throw new Error("Two-Factor Authentication error.");
    }
  }

  return new VRChatApiClient(apiKey, authToken, repository);
};

export const loginWithAuthToken = async (authToken: string) => {
  const config = await repository.get<Config>("config");
  const apiKey = config.apiKey;

  return new VRChatApiClient(apiKey, authToken, repository);
};

export { baseUrl, login };
