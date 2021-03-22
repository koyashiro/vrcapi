import { VRChatApiRepository } from "../repositories/VRChatApiRepository.ts";
import { User } from "../interfaces/User.ts";
import { CurrentUser } from "../interfaces/CurrentUser.ts";

export class UserApiClient {
  private readonly _apiKey: string;
  private readonly _authToken: string;
  private readonly _repository: VRChatApiRepository;

  constructor(
    apiKey: string,
    authToken: string,
    repository: VRChatApiRepository,
  ) {
    this._apiKey = apiKey;
    this._authToken = authToken;
    this._repository = repository;
  }

  public getCurrentUser(): Promise<CurrentUser> {
    return this._repository.getWithAuthToken<CurrentUser>(
      "auth/user",
      this._apiKey!,
      this._authToken!,
    );
  }

  public getUserById(id: string): Promise<User> {
    return this._repository.getWithAuthToken<User>(
      `users/${id}`,
      this._apiKey!,
      this._authToken!,
    );
  }

  public getFriends(): Promise<User[]> {
    return this._repository.getWithAuthToken<User[]>(
      "auth/user/friends",
      this._apiKey!,
      this._authToken!,
    );
  }
}
