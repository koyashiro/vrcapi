import { encode } from "https://deno.land/std/encoding/base64.ts";
import { getAuthToken } from "./util.ts";

export class VrcApiRepository {
  public readonly baseUrl: URL;

  constructor(baseUrl: string | URL) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  public async get<T>(relativeUrl: string): Promise<T> {
    const url = new URL(relativeUrl, this.baseUrl);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;
    return value;
  }

  public async getWithBasic<T>(
    relativeUrl: string,
    apiKey: string,
    username: string,
    password: string,
  ): Promise<[value: T, authToken: string]> {
    const url = new URL(relativeUrl, this.baseUrl);
    url.searchParams.append("apiKey", apiKey);

    const credential = encode(`${username}:${password}`);
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

  public async postWithAuthToken<T>(
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
      throw new Error("Response is not ok.");
    }

    const value = await response.json() as T;
    return value;
  }

  public async getWithAuthToken<T>(
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
