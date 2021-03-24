import { VRChatApiRepository } from "./repository.ts";
import { CurrentUser } from "./user.ts";
import { VRChatApiClient } from "./client.ts";
import { BASE_URL } from "./util.ts";

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

export interface Verify {
  verified: boolean;
}

export async function login(
  username: string,
  password: string,
  code?: string,
) {
  const repository = new VRChatApiRepository(BASE_URL, {
    basicCredential: { username, password },
  });

  const config = await repository.get<Config>("config");
  const apiKey = config.apiKey;

  const params = new Map<string, string | undefined>();
  params.set("apiKey", apiKey);

  const currentUser = await repository.get<CurrentUser>("auth/user", {
    useBasic: true,
    params,
  });

  if (currentUser.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require Two-Factor Authentication.");
    }

    const verify = await repository.post<Verify>(
      "auth/twofactorauth/totp/verify",
      { code },
      { useAuth: true },
    );
    if (!verify.verified) {
      throw new Error("Two-Factor Authentication error.");
    }
  }

  return new VRChatApiClient(repository);
}

export const loginWithAuthToken = async (authToken: string) => {
  const repository = new VRChatApiRepository(BASE_URL);

  const config = await repository.get<Config>("config");
  const apiKey = config.apiKey;

  repository.authCredential = { apiKey, authToken };

  return new VRChatApiClient(repository);
};
