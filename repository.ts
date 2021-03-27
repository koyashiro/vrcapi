import { encode } from "https://deno.land/std/encoding/base64.ts";

function getBasicString(username: string, password: string) {
  const credential = encode(`${username}:${password}`);
  return `Basic ${credential}`;
}

function getApiKey(cookie: string): string | null {
  const result = cookie.match(/.*apiKey=(?<apiKey>.*);.*/);
  if (!result || !result.groups) {
    return null;
  }
  return result.groups["apiKey"];
}

function getAuthToken(cookie: string): string | null {
  const result = cookie.match(/.*auth=(?<authToken>.*);.*/);
  if (!result || !result.groups) {
    return null;
  }
  return result.groups["authToken"];
}

function createCookie(apiKey: string, authToken: string): string {
  return `apiKey=${apiKey};auth=${authToken}`;
}

function createHeader(
  option?: Option,
  authCredential?: AuthCredential,
): HeadersInit {
  const headers = new Headers();

  if (option?.basic) {
    const basic = getBasicString(
      option.basic.username,
      option.basic.password,
    );
    headers.set("authorization", basic);
  }

  if (option?.useAuth) {
    if (!authCredential) {
      throw new Error();
    }

    const cookie = createCookie(
      authCredential.apiKey,
      authCredential.authToken,
    );
    headers.set("cookie", cookie);
  }

  return headers;
}

function createURL(
  relativeUrl: string,
  baseUrl: string | URL,
  params?: Params,
): URL {
  const url = new URL(relativeUrl, baseUrl);

  if (params) {
    for (const [key, value] of params) {
      url.searchParams.set(key, value ?? "");
    }
  }
  return url;
}

export interface BasicCredential {
  username: string;
  password: string;
}

export interface AuthCredential {
  apiKey: string;
  authToken: string;
}

export type Params = Map<string, string | undefined>;

export interface Option {
  params?: Params;
  basic?: BasicCredential;
  useAuth?: boolean;
}

export interface ApiRepository {
  authCredential?: AuthCredential;

  get<T>(relativeUrl: string, option?: Option): Promise<T>;

  post<T>(relativeUrl: string, body: unknown, option?: Option): Promise<T>;
}

export class VRChatApiRepository implements ApiRepository {
  authCredential?: AuthCredential;
  readonly baseUrl: URL;

  constructor(
    baseUrl: string | URL,
    credential?: {
      authCredential?: AuthCredential;
    },
  ) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
    this.authCredential = credential?.authCredential;
  }

  async get<T>(relativeUrl: string, option?: Option): Promise<T> {
    const url = createURL(relativeUrl, this.baseUrl, option?.params);

    const headers = createHeader(
      option,
      this.authCredential,
    );

    const request: RequestInit = {
      method: "GET",
      headers,
    };

    const response = await fetch(url, request);

    if (!response.ok) {
      console.log(request);
      console.log(request);
      console.log(await response.json());
      throw new Error("Response is not ok.");
    }

    if (!this.authCredential) {
      const cookie = response.headers.get("set-cookie");
      if (cookie) {
        const apiKey = getApiKey(cookie);
        const authToken = getAuthToken(cookie);
        if (apiKey && authToken) {
          this.authCredential = {
            apiKey,
            authToken,
          };
        }
      }
    }

    return await response.json() as T;
  }

  async post<T>(
    relativeUrl: string,
    body: unknown,
    option?: Option,
  ): Promise<T> {
    const url = createURL(relativeUrl, this.baseUrl, option?.params);

    const headers = createHeader(
      option,
      this.authCredential,
    );

    const request: RequestInit = {
      method: "POST",
      headers,
      body: typeof body == "string" ? body : JSON.stringify(body),
    };

    const response = await fetch(url, request);

    if (!response.ok) {
      console.log(request);
      console.log(await response.json());
      console.log(body);
      throw new Error("Response is not ok.");
    }

    if (!this.authCredential) {
      const cookie = response.headers.get("set-cookie");
      if (cookie) {
        const apiKey = getApiKey(cookie);
        const authToken = getAuthToken(cookie);
        if (apiKey && authToken) {
          this.authCredential = {
            apiKey,
            authToken,
          };
        }
      }
    }

    return await response.json() as T;
  }
}
