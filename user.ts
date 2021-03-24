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
  readonly #repository: ApiRepository;

  constructor(repository: ApiRepository) {
    this.#repository = repository;
  }

  getUserById(id: string): Promise<User> {
    return this.#repository.get<User>(`users/${id}`, { useAuth: true });
  }

  getUserByUserName(username: string): Promise<User> {
    return this.#repository.get<User>(`users/${username}/name`, {
      useAuth: true,
    });
  }
}
