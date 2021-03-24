import { ApiRepository } from "./repository.ts";

export interface Verify {
  verified: boolean;
}

export class TwoFactorApiClient {
  readonly #repository: ApiRepository;

  constructor(repository: ApiRepository) {
    this.#repository = repository;
  }

  postVerify(code: string): Promise<Verify> {
    return this.#repository.post<Verify>("auth/twofactorauth/totp/verify", {
      code,
    }, { useAuth: true });
  }
}
