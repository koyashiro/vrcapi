import { User, VrcApiRepository } from "./VrcApiRepository.ts";
import { getBasicString } from "./util.ts";

export const baseUrl = "https://vrchat.com/api/1";
const vrcApiRepository = new VrcApiRepository(baseUrl);

export async function login(
  username: string,
  password: string,
  code?: string,
): Promise<VrcApiSession> {
  const config = await vrcApiRepository.getConfig();
  const apiKey = config.clientApiKey;

  const basic = getBasicString(username, password);

  const [user, authToken] = await vrcApiRepository.getUserWithBasic(
    basic,
    apiKey,
  );

  if (user.requiresTwoFactorAuth) {
    if (!code) {
      throw new Error("Require two factor auth.");
    }
    const verify = await vrcApiRepository.postVerify(
      { apiKey, authToken },
      code,
    );
    if (!verify.verified) {
      throw new Error("Two-factor Authentication error.");
    }
  }

  const session: VrcApiSession = { apiKey, authToken };

  return session;
}

export async function getUser(session: VrcApiSession): Promise<User> {
  const user = await vrcApiRepository.getUser(session);
  return user;
}

export interface VrcApiSession {
  apiKey: string;
  authToken: string;
}
