import { UserApiClient } from "./UserApiClient.ts";
import { ApiRepository } from "../repositories/ApiRepository.ts";

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
