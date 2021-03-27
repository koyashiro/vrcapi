import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { assertExportMembers } from "./test_util.ts";
import { BASE_URL } from "./common.ts";
import {
  getApiKeyFromEnv,
  getAuthTokenFromEnv,
  getPasswordFromEnv,
  getUsernameFromEnv,
} from "./env.ts";
import { VRChatApiRepository } from "./repository.ts";
import * as login from "./login.ts";

Deno.test("Export members", () => {
  const expectedMembers = [
    "LoginClient",
    "login",
    "loginWithAuthToken",
  ];
  const actualMembers = Object.keys(login);
  assertExportMembers("login", expectedMembers, actualMembers);
});

const username = getUsernameFromEnv();
const password = getPasswordFromEnv();
const apiKey = getApiKeyFromEnv();
const authToken = getAuthTokenFromEnv();

Deno.test("Get user with basic", async () => {
  const repository = new VRChatApiRepository(BASE_URL);
  const client = new login.LoginClient(repository);
  const user = await client.getUserWithBasic(username, password, apiKey);
  assert(user);
});

Deno.test("Get user with auth token", async () => {
  const repository = new VRChatApiRepository(BASE_URL, {
    authCredential: { apiKey, authToken },
  });
  const client = new login.LoginClient(repository);
  const user = await client.getUserWithWithAuth();
  assert(user);
});

Deno.test("Login with basic", async () => {
  const client = await login.login(username, password);
  assert(client);
});

Deno.test("Login with auth token", async () => {
  const client = await login.loginWithAuthToken(authToken, apiKey);
  assert(client);
});
