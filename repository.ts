import { encode } from "https://deno.land/std/encoding/base64.ts";

export interface BasicCredential {
  username: string;
  password: string;
}

export interface AuthCredential {
  apiKey: string;
  authToken: string;
}

type Credential = AuthCredential | BasicCredential;

export type Params = {
  [key: string]: string | null;
};

function extractAuthCredential(cookie: string): AuthCredential | null {
  let result = cookie.match(/.*apiKey=(?<apiKey>.*);.*/);
  if (!result || !result.groups) {
    return null;
  }
  const apiKey = result.groups["apiKey"];

  result = cookie.match(/.*auth=(?<authToken>.*);.*/);
  if (!result || !result.groups) {
    return null;
  }
  const authToken = result.groups["authToken"];

  return { apiKey, authToken };
}

function createBasicString(username: string, password: string) {
  const credential = encode(`${username}:${password}`);
  return `Basic ${credential}`;
}

function createCookie(apiKey: string, authToken: string): string {
  return `apiKey=${apiKey};authCredential=${authToken}`;
}

function createHeader(credential: Credential): HeadersInit {
  const headers = new Headers();

  if ("username" in credential) {
    const basic = createBasicString(credential.username, credential.password);
    headers.set("authorization", basic);
  }

  if ("authToken" in credential) {
    const cookie = createCookie(credential.apiKey, credential.authToken);
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
    for (const key in params) {
      const value = params[key];
      url.searchParams.set(key, value ?? "");
    }
  }
  return url;
}

export interface RepositoryInit {
  readonly baseUrl: URL;

  // deno-lint-ignore no-explicit-any
  get(relativeUrl: string, params?: Params): Promise<any>;
}

export class Repository implements RepositoryInit {
  readonly baseUrl: URL;

  constructor(baseUrl: string | URL) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
  }

  // deno-lint-ignore no-explicit-any
  async get(relativeUrl: string, params?: Params): Promise<any> {
    const url = createURL(relativeUrl, this.baseUrl, params);
    const request: RequestInit = { method: "GET" };
    const response = await fetch(url, request);
    return await response.json();
  }
}

export interface BasicRepositoryInit {
  readonly baseUrl: URL;
  readonly credential: BasicCredential;

  get(relativeUrl: string, params?: Params): Promise<AuthCredential>;
}

export class BasicRepository implements BasicRepositoryInit {
  readonly baseUrl: URL;
  readonly credential: BasicCredential;

  constructor(baseUrl: string | URL, credential: BasicCredential) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
    this.credential = credential;
  }

  async get(relativeUrl: string, params?: Params): Promise<AuthCredential> {
    const url = createURL(relativeUrl, this.baseUrl, params);
    const headers = createHeader(this.credential);
    const request: RequestInit = { method: "GET", headers };
    const response = await fetch(url, request);
    const body = await response.json();
    if (!response.ok) {
      if ("error" in body && "message" in body.error) {
        throw new Error(body.error.message);
      } else {
        throw new Error(response.statusText);
      }
    }
    const cookie = response.headers.get("set-cookie");
    if (!cookie) {
      throw new Error("Invalid cookie");
    }
    const authCredential = extractAuthCredential(cookie);
    if (!authCredential) {
      throw new Error("Invalid cookie");
    }
    return authCredential;
  }
}

export interface AuthRepositoryInit {
  readonly baseUrl: URL;
  readonly credential: AuthCredential;

  // deno-lint-ignore no-explicit-any
  get(relativeUrl: string, params?: Params): Promise<any>;

  // deno-lint-ignore no-explicit-any
  post(relativeUrl: string, body: unknown, params?: Params): Promise<any>;

  // deno-lint-ignore no-explicit-any
  put(relativeUrl: string, body: unknown, params?: Params): Promise<any>;
}

export class AuthRepository implements AuthRepositoryInit {
  readonly baseUrl: URL;
  readonly credential: AuthCredential;

  constructor(baseUrl: string | URL, credential: AuthCredential) {
    if (typeof baseUrl === "string") {
      this.baseUrl = new URL(baseUrl);
    } else {
      this.baseUrl = baseUrl;
    }
    this.credential = credential;
  }

  // deno-lint-ignore no-explicit-any
  async get(relativeUrl: string, params?: Params): Promise<any> {
    const url = createURL(relativeUrl, this.baseUrl, params);
    const headers = createHeader(this.credential);
    const request: RequestInit = { method: "GET", headers };
    const response = await fetch(url, request);
    return await response.json();
  }

  async post(
    relativeUrl: string,
    body: unknown,
    params?: Params,
    // deno-lint-ignore no-explicit-any
  ): Promise<any> {
    const url = createURL(relativeUrl, this.baseUrl, params);
    const headers = createHeader(this.credential);
    const request: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(url, request);
    return await response.json();
  }

  async put(
    relativeUrl: string,
    body?: unknown,
    params?: Params,
    // deno-lint-ignore no-explicit-any
  ): Promise<any> {
    const url = createURL(relativeUrl, this.baseUrl, params);
    const headers = createHeader(this.credential);
    const request: RequestInit = {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(url, request);
    return response.json();
  }
}
