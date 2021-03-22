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
