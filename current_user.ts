import { ApiRepository } from "./repository.ts";
import { User } from "./user.ts";

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

export class CurrentUserApiClient {
  readonly #repository: ApiRepository;

  constructor(repository: ApiRepository) {
    this.#repository = repository;
  }

  getCurrentUser(): Promise<CurrentUser> {
    return this.#repository.get<CurrentUser>("auth/user", { useAuth: true });
  }

  getFriends(): Promise<User[]> {
    return this.#repository.get<User[]>("auth/user/friends", { useAuth: true });
  }
}
