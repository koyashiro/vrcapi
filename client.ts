import { ApiRepository, AuthCredential } from "./repository.ts";
import { UserApiClient } from "./user.ts";
import { WorldApiClient } from "./world.ts";

export class VRChatApiClient {
  readonly authCredential: AuthCredential;
  readonly user: UserApiClient;
  readonly world: WorldApiClient;

  constructor(
    repository: ApiRepository,
  ) {
    if (!repository.authCredential) {
      throw new Error("Invalid repository.");
    }

    this.authCredential = repository.authCredential;
    this.user = new UserApiClient(repository);
    this.world = new WorldApiClient(repository);
  }
}
