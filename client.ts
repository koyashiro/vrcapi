import { ConfigApiClient } from "./config.ts";
import { ApiRepository } from "./repository.ts";
import { UserApiClient } from "./user.ts";
import { CurrentUserApiClient } from "./current_user.ts";
import { WorldApiClient } from "./world.ts";

export class VRChatApiClient {
  readonly #repository: ApiRepository;
  readonly config: ConfigApiClient;
  readonly user: UserApiClient;
  readonly currentUser: CurrentUserApiClient;
  readonly world: WorldApiClient;

  constructor(
    repository: ApiRepository,
  ) {
    this.#repository = repository;
    this.config = new ConfigApiClient(repository);
    this.user = new UserApiClient(repository);
    this.currentUser = new CurrentUserApiClient(repository);
    this.world = new WorldApiClient(repository);
  }

  get authCredential() {
    return this.#repository.authCredential;
  }
}
