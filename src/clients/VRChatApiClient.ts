import { UserApiClient } from "./UserApiClient.ts";
import { ApiRepository } from "../repositories/ApiRepository.ts";

export class VRChatApiClient {
  public readonly apiKey: string;
  public readonly authToken: string;
  public readonly user: UserApiClient;

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
