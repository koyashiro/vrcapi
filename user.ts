import { ApiRepository } from "./repository.ts";

export interface User {
  id: string;
  username: string;
  displayName: string;
  userIcon: string;
  bio: string;
  bioLinks: any[];
  currentAvatarImageUrl: string;
  currentAvatarThumbnailImageUrl: string;
  fallbackAvatar: string;
  status: Status;
  statusDescription: string;
  state: State;
  tags: string[];
  developerType: DevelopperType;
  last_login: Date;
  last_platform: string;
  allowAvatarCopying: boolean;
  date_joined: string;
  isFriend: boolean;
  friendKey: string;
  location: string;
  worldId: string;
}

export interface CurrentUser {
  id: string;
  username: string;
  displayName: string;
  userIcon: string;
  bio: string;
  bioLinks: string[];
  pastDisplayNames: {
    displayName: string;
    updated_at: Date;
  }[];
  hasEmail: boolean;
  hasPendingEmail: boolean;
  email: string;
  obfuscatedEmail: string;
  obfuscatedPendingEmail: string;
  emailVerified: boolean;
  hasBirthday: boolean;
  unsubscribe: boolean;
  friends: string[];
  friendGroupNames: any[];
  currentAvatarImageUrl: string;
  currentAvatarThumbnailImageUrl: string;
  fallbackAvatar: string;
  currentAvatar: string;
  currentAvatarAssetUrl: string;
  accountDeletionDate?: any;
  acceptedTOSVersion: number;
  steamId: string;
  steamDetails: {};
  oculusId: string;
  hasLoggedInFromClient: boolean;
  homeLocation: string;
  twoFactorAuthEnabled: boolean;
  feature: {
    twoFactorAuth: boolean;
  };
  status: string;
  statusDescription: string;
  state: string;
  tags: string[];
  developerType: string;
  last_login: Date;
  last_platform: string;
  allowAvatarCopying: boolean;
  date_joined: string;
  isFriend: boolean;
  friendKey: string;
  onlineFriends: string[];
  activeFriends: string[];
  offlineFriends: string[];
  requiresTwoFactorAuth?: string[];
}

enum State {
  Online = "online",
  Active = "active",
  Offline = "offline",
}

enum Status {
  Active = "active",
  JoinMe = "join me",
  AskMe = "ask me",
  Busy = "busy",
  Offline = "offline",
}

enum DevelopperType {
  None = "none",
  Trusted = "trusted",
  Internal = "internal",
  Moderator = "moderator",
}

export class UserApiClient {
  private readonly _apiKey: string;
  private readonly _authToken: string;
  private readonly _repository: ApiRepository;

  constructor(
    apiKey: string,
    authToken: string,
    repository: ApiRepository,
  ) {
    this._apiKey = apiKey;
    this._authToken = authToken;
    this._repository = repository;
  }

  getCurrentUser(): Promise<CurrentUser> {
    return this._repository.getWithAuthToken<CurrentUser>(
      "auth/user",
      this._apiKey!,
      this._authToken!,
    );
  }

  getUserById(id: string): Promise<User> {
    return this._repository.getWithAuthToken<User>(
      `users/${id}`,
      this._apiKey!,
      this._authToken!,
    );
  }

  getFriends(): Promise<User[]> {
    return this._repository.getWithAuthToken<User[]>(
      "auth/user/friends",
      this._apiKey!,
      this._authToken!,
    );
  }
}
