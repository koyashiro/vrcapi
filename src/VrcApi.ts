import { VrcApiRepository } from "./VrcApiRepository.ts";
import { Config, CurrentUser, User, Verify } from "./interfaces/mod.ts";

export const baseUrl = "https://vrchat.com/api/1/";
const vrcApiRepository = new VrcApiRepository(baseUrl);

export class VrcApi {
  private readonly _repository: VrcApiRepository;
  private _apiKey?: string;
  private _authToken?: string;
  private _isLoggedIn: boolean;

  constructor(repository?: VrcApiRepository) {
    if (!repository) {
      this._repository = vrcApiRepository;
    } else {
      this._repository = repository;
    }

    this._isLoggedIn = false;
  }

  public get apiKey() {
    return this._apiKey;
  }

  public get authToken() {
    return this._authToken;
  }

  public get isLoggedIn() {
    return this._isLoggedIn;
  }

  public async login(
    username: string,
    password: string,
    code?: string,
  ): Promise<boolean> {
    if (this._isLoggedIn) {
      return true;
    }

    const config = await this._repository.get<Config>("config");
    this._apiKey = config.clientApiKey;

    const [currentUser, authToken] = await this._repository.getWithBasic<
      CurrentUser
    >(
      "auth/user",
      this._apiKey,
      username,
      password,
    );
    this._authToken = authToken;

    if (currentUser.requiresTwoFactorAuth) {
      if (!code) {
        console.log("Require Two-Factor Authentication.");
        return false;
      }
      const verify = await vrcApiRepository.postWithAuthToken<Verify>(
        "auth/twofactorauth/totp/verify",
        this._apiKey,
        this._authToken,
        JSON.stringify({ code }),
      );
      if (!verify.verified) {
        console.log("Two-Factor Authentication error.");
        return false;
      }
    }

    this._isLoggedIn = true;
    return true;
  }

  public async loadAuthToken(authToken: string): Promise<boolean> {
    this._apiKey = undefined;
    this._authToken = undefined;
    this._isLoggedIn = false;

    if (!authToken) {
      return false;
    }

    const config = await this._repository.get<Config>("config");

    const user = await this._repository.getWithAuthToken<CurrentUser>(
      "auth/user",
      config.clientApiKey,
      authToken,
    );

    if (user.requiresTwoFactorAuth) {
      return false;
    }

    this._apiKey = config.clientApiKey;
    this._authToken = authToken;
    this._isLoggedIn = true;
    return true;
  }

  public async getCurrentUser(): Promise<CurrentUser> {
    if (!this._isLoggedIn) {
      throw new Error();
    }

    const currentUser = await vrcApiRepository.getWithAuthToken<CurrentUser>(
      "auth/user",
      this._apiKey!,
      this._authToken!,
    );
    return currentUser;
  }

  public async getUser(id: string): Promise<User> {
    if (!this._isLoggedIn) {
      throw new Error();
    }

    const user = await vrcApiRepository.getWithAuthToken<User>(
      `users/${id}`,
      this._apiKey!,
      this._authToken!,
    );
    return user;
  }

  public async getFriends(): Promise<User[]> {
    if (!this._isLoggedIn) {
      throw new Error();
    }

    const users = await vrcApiRepository.getWithAuthToken<User[]>(
      "auth/user/friends",
      this._apiKey!,
      this._authToken!,
    );
    return users;
  }
}
