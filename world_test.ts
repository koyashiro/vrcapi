import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { BASE_URL } from "./common.ts";
import { getApiKeyFromEnv, getAuthTokenFromEnv } from "./env.ts";
import { WorldApiClient } from "./world.ts";
import { VRChatApiRepository } from "./repository.ts";

const apiKey = getApiKeyFromEnv();
const authToken = getAuthTokenFromEnv();

const repository = new VRChatApiRepository(BASE_URL, {
  authCredential: { apiKey, authToken },
});
const client = new WorldApiClient(repository);

Deno.test("Get world by Id", async () => {
  // VRChat Home
  const worldId = "wrld_4432ea9b-729c-46e3-8eaf-846aa0a37fdd";

  const world = await client.getWorldById(worldId);
  assertEquals(world.id, worldId);
});

Deno.test("Get any worlds", async () => {
  const worlds = await client.getAnyWorlds();
  assert(worlds.length);
  for (const world of worlds) {
    assert(world);
  }
});

Deno.test("Get active worlds", async () => {
  const worlds = await client.getActiveWorlds();
  assert(worlds.length);
  for (const world of worlds) {
    assert(world);
  }
});

Deno.test("Get favorite worlds", async () => {
  const worlds = await client.getFavoriteWorlds();
  assert(worlds.length);
  for (const world of worlds) {
    assert(world);
  }
});

Deno.test("Get recent worlds", async () => {
  const worlds = await client.getRecentWorlds();
  assert(worlds.length);
  for (const world of worlds) {
    assert(world);
  }
});

Deno.test("Get world metadata by Id", async () => {
  // VRChat Home
  const worldId = "wrld_4432ea9b-729c-46e3-8eaf-846aa0a37fdd";

  const metadata = await client.getWorldMetadataById(worldId);
  assertEquals(metadata.id, worldId);
});
