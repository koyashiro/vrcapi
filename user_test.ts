import { assertEquals } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { UserApiClient } from "./user.ts";
import { VRChatApiRepository } from "./repository.ts";
import { BASE_URL, getApiKeyFromEnv, getAuthTokenFromEnv } from "./util.ts";

const apiKey = getApiKeyFromEnv();
const authToken = getAuthTokenFromEnv();

const repository = new VRChatApiRepository(BASE_URL, {
  authCredential: { apiKey, authToken },
});
const client = new UserApiClient(repository);

Deno.test("Get user by Id", async () => {
  // TODO: User id
  const userId = "";

  const user = await client.getUserById(userId);
  assertEquals(user.id, userId);
});

Deno.test("Get user by username", async () => {
  // TODO: User name
  const username = "";

  const user = await client.getUserByUserName(username);
  assertEquals(user.id, username);
});
