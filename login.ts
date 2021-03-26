import { ApiRepository, VRChatApiRepository } from "./repository.ts";
import { VRChatApiClient } from "./client.ts";
import { Config, ConfigApiClient } from "./config.ts";
import { CurrentUser } from "./current_user.ts";
import { BASE_URL } from "./util.ts";

export interface Verify {
  verified: boolean;
}

export class LoginClient {
  readonly #repository: ApiRepository;

  constructor(repository: ApiRepository) {
    this.#repository = repository;
  }

  getUserWithBasic(username: string, password: string): Promise<CurrentUser> {
    return this.#repository.get<CurrentUser>("auth/user", {
      basic: { username, password },
    });
  }

  getUserWithWithAuth(): Promise<CurrentUser> {
    if (!this.#repository.authCredential) {
      throw new Error("Auth credential required.");
    }
    return this.#repository.get<CurrentUser>("auth/user", { useAuth: true });
  }

  postVerify(code: string): Promise<Verify> {
    return this.#repository.post<Verify>("auth/twofactorauth/totp/verify", {
      code,
    }, { useAuth: true });
  }
}

export async function login(
  username: string,
  password: string,
  code?: string,
) {
  const repository = new VRChatApiRepository(BASE_URL);
  const loginClient = new LoginClient(repository);

  const apiKey = await getApiKey();

  const params = new Map<string, string | undefined>();
  params.set("apiKey", apiKey);

  const currentUser = await loginClient.getUserWithBasic(username, password);

  if (currentUser.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require Two-Factor Authentication.");
    }

    const verify = await loginClient.postVerify(code);
    if (!verify.verified) {
      throw new Error("Two-Factor Authentication error.");
    }
  }

  return new VRChatApiClient(repository);
}

export async function loginWithAuthToken(
  authToken: string,
  apiKey?: string,
  code?: string,
): Promise<VRChatApiClient> {
  const repository = new VRChatApiRepository(BASE_URL, {
    authCredential: { apiKey: apiKey ?? await getApiKey(), authToken },
  });
  const loginClient = new LoginClient(repository);

  const currentUser = await loginClient.getUserWithWithAuth();

  if (currentUser.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require Two-Factor Authentication.");
    }

    const verify = await loginClient.postVerify(code);
    if (!verify.verified) {
      throw new Error("Two-Factor Authentication error.");
    }
  }

  return new VRChatApiClient(repository);
}

async function getApiKey(): Promise<string> {
  const repository = new VRChatApiRepository(BASE_URL);
  const configClient = new ConfigApiClient(repository);
  const config = await configClient.getConfig() as Config;
  return config.clientApiKey;
}
