import { getAuthToken, getBasicString } from "./util.ts";

export interface ApiRepository {
  get<T>(relativeUrl: string): Promise<T>;

  getWithBasic<T>(
    relativeUrl: string,
    apiKey: string,
    username: string,
    password: string,
  ): Promise<[value: T, authToken: string]>;

  postWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
    body: string,
  ): Promise<T>;

  getWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
  ): Promise<T>;
}

export class VRChatApiRepository implements ApiRepository {
  readonly baseUrl: URL;

  constructor(baseUrl: string | URL) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  async get<T>(relativeUrl: string): Promise<T> {
    const url = new URL(relativeUrl, this.baseUrl);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;
    return value;
  }

  async getWithBasic<T>(
    relativeUrl: string,
    apiKey: string,
    username: string,
    password: string,
  ): Promise<[value: T, authToken: string]> {
    const url = new URL(relativeUrl, this.baseUrl);
    url.searchParams.append("apiKey", apiKey);

    const credential = getBasicString(username, password);
    const basic = `Basic ${credential}`;

    const headers = new Headers();
    headers.set("authorization", basic);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;

    const cookie = response.headers.get("set-cookie");
    if (!cookie) {
      throw new Error("cookie is not exists.");
    }

    const authToken = getAuthToken(cookie);

    return [value, authToken];
  }

  async postWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
    body: string,
  ): Promise<T> {
    const url = new URL(relativeUrl, this.baseUrl);
    url.searchParams.append("apiKey", apiKey);

    const headers = new Headers();
    headers.set("cookie", `auth=${authToken}`);
    headers.set("content-type", "application/json");
    headers.set("content-length", body.length.toString());

    const request = {
      method: "POST",
      headers,
      body,
    };

    const response = await fetch(url, request);

    if (!response.ok) {
      console.log(request);
      console.log(response);
      console.log(await response.json());
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;
    return value;
  }

  async getWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
  ): Promise<T> {
    const url = new URL(relativeUrl, this.baseUrl);
    url.searchParams.append("apiKey", apiKey);

    const headers = new Headers();
    headers.set("cookie", `auth=${authToken}`);

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;
    return value;
  }
}
