import { getAuthToken } from "./util.ts";

export class VrcApiRepository {
  public readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public async getConfig(): Promise<Config> {
    const url = `${this.baseUrl}/config`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const config = await response.json() as Config;
    return config;
  }

  public async getUserWithBasic(
    basic: string,
    apiKey: string,
  ): Promise<[auth: User, authToken: string]> {
    const url = `${this.baseUrl}/auth/user`;

    const headers = new Headers();
    headers.set("Authorization", basic);

    const response = await fetch(`${url}?apiKey=${apiKey}`, {
      method: "GET",
      headers,
    });

    const user = await response.json() as User;

    const cookie = response.headers.get("set-cookie");
    if (!cookie) {
      throw new Error("cookie is not exists.");
    }

    const authToken = getAuthToken(cookie);
    return [user, authToken];
  }

  public async postVerify(
    session: { apiKey: string; authToken: string },
    code: string,
  ): Promise<Verify> {
    const url = `${this.baseUrl}/auth/twofactorauth/totp/verify`;
    const cookie = `auth=${session.authToken}`;

    const body = JSON.stringify({ code });

    const headers = new Headers();
    headers.set("Cookie", cookie);
    headers.set("Content-Type", "application/json");
    headers.set("Content-Length", body.length.toString());

    const response = await fetch(`${url}?apiKey=${session.apiKey}`, {
      method: "POST",
      credentials: "include",
      headers,
      body,
    });

    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const verify = await response.json() as Verify;
    return verify;
  }

  public async getUser(
    session: { apiKey: string; authToken: string },
  ): Promise<User> {
    const url = `${this.baseUrl}/auth/user`;
    const cookie = `auth=${session.authToken}`;

    const headers = new Headers();
    headers.set("Cookie", cookie);

    const response = await fetch(`${url}?apiKey=${session.apiKey}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const user = await response.json() as User;

    return user;
  }
}

export interface Config {
  messageOfTheDay: string;
  events: {
    distanceClose: number;
    distanceFactor: number;
    distanceFar: number;
    groupDistance: number;
    maximumBunchSize: number;
    notVisibleFactor: number;
    playerOrderBucketSize: number;
    playerOrderFactor: number;
    slowUpdateFactorThreshold: number;
    viewSegmentLength: number;
  };
  "dis-countdown": Date;
  homepageRedirectTarget: string;
  "youtubedl-hash": string;
  "youtubedl-version": string;
  timeOutWorldId: string;
  gearDemoRoomId: string;
  releaseServerVersionStandalone: string;
  downloadLinkWindows: string;
  releaseAppVersionStandalone: string;
  devAppVersionStandalone: string;
  devServerVersionStandalone: string;
  devDownloadLinkWindows: string;
  currentTOSVersion: number;
  releaseSdkUrl: string;
  releaseSdkVersion: string;
  devSdkUrl: string;
  devSdkVersion: string;
  whiteListedAssetUrls: string[];
  clientApiKey: string;
  viveWindowsUrl: string;
  sdkUnityVersion: string;
  hubWorldId: string;
  homeWorldId: string;
  tutorialWorldId: string;
  disableEventStream: boolean;
  disableAvatarGating: boolean;
  disableFeedbackGating: boolean;
  disableRegistration: boolean;
  disableUpgradeAccount: boolean;
  disableCommunityLabs: boolean;
  disableCommunityLabsPromotion: boolean;
  disableTwoFactorAuth: boolean;
  disableSteamNetworking: boolean;
  disableHello: boolean;
  disableUdon: boolean;
  plugin: string;
  sdkNotAllowedToPublishMessage: string;
  sdkDeveloperFaqUrl: string;
  sdkDiscordUrl: string;
  notAllowedToSelectAvatarInPrivateWorldMessage: string;
  userVerificationTimeout: number;
  userUpdatePeriod: number;
  userVerificationDelay: number;
  userVerificationRetry: number;
  worldUpdatePeriod: number;
  moderationQueryPeriod: number;
  clientDisconnectTimeout: number;
  defaultAvatar: string;
  dynamicWorldRows: {
    name: string;
    sortHeading: string;
    sortOwnership: string;
    sortOrder: string;
    platform: string;
    index: number;
    tag: string;
  }[];
  disableAvatarCopying: boolean;
  announcements: {
    name: string;
    text: string;
  }[];
  urlList: string[];
  useReliableUdpForVoice: boolean;
  updateRateMsMaximum: number;
  updateRateMsMinimum: number;
  updateRateMsNormal: number;
  clientBPSCeiling: number;
  clientReservedPlayerBPS: number;
  clientSentCountAllowance: number;
  uploadAnalysisPercent: number;
  downloadUrls: {
    sdk2: string;
    "sdk3-worlds": string;
    "sdk3-avatars": string;
  };
  address: string;
  contactEmail: string;
  supportEmail: string;
  jobsEmail: string;
  copyrightEmail: string;
  moderationEmail: string;
  disableEmail: boolean;
  appName: string;
  serverName: string;
  deploymentGroup: string;
  buildVersionTag: string;
  apiKey: string;
}

export interface User {
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

export interface Verify {
  verified: boolean;
}
