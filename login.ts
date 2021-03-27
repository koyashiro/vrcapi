import { BASE_URL } from "./common.ts";
import { ApiRepository, VRChatApiRepository } from "./repository.ts";
import { VRChatApiClient } from "./client.ts";
import { CurrentUser } from "./current_user.ts";
import { getApiKey } from "./util.ts";

export interface Verify {
  verified: boolean;
}

export class LoginClient {
  readonly #repository: ApiRepository;

  constructor(repository: ApiRepository) {
    this.#repository = repository;
  }

  getUserWithBasic(
    username: string,
    password: string,
    apiKey: string,
  ): Promise<CurrentUser> {
    return this.#repository.get<CurrentUser>("auth/user", {
      basic: { username, password },
      params: { apiKey },
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

  const currentUser = await loginClient.getUserWithBasic(
    username,
    password,
    apiKey,
  );

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
