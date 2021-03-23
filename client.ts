import { ApiRepository } from "./repository.ts";
import { UserApiClient } from "./user.ts";

export class VRChatApiClient {
  readonly apiKey: string;
  readonly authToken: string;
  readonly user: UserApiClient;

  constructor(
    apiKey: string,
    authToken: string,
    repository: ApiRepository,
  ) {
    this.apiKey = apiKey;
    this.authToken = authToken;
    this.user = new UserApiClient(apiKey, authToken, repository);
  }
}
