import { encode } from "https://deno.land/std/encoding/base64.ts";

export const BASE_URL = "https://vrchat.com/api/1/";

export function getBasicString(username: string, password: string) {
  const credential = encode(`${username}:${password}`);
  return `Basic ${credential}`;
}

export function getAuthToken(cookie: string): string {
  const result = cookie.match(/.*auth=(?<authToken>.*);.*/);
  if (!result || !result.groups) {
    console.log(cookie);
    throw new Error("Invalid cookie.");
  }

  const authToken = result.groups.authToken;
  return authToken;
}

export const baseUrl = "https://vrchat.com/api/1/";

export function getAuthTokenFromEnv() {
  const authToken = Deno.env.get("VRC_API_AUTH_TOKEN");
  if (!authToken) {
    throw new Error("`$VRC_API_AUTH_TOKEN` is not exists.");
  }
  return authToken;
}
