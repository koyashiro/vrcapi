import { encode } from "https://deno.land/std/encoding/base64.ts";

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
