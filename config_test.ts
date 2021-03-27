import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { BASE_URL } from "./common.ts";
import { ConfigApiClient } from "./config.ts";
import { VRChatApiRepository } from "./repository.ts";

const API_KEY = "JlE5Jldo5Jibnk5O5hTx6XVqsJu4WJ26";
const repository = new VRChatApiRepository(BASE_URL);
const client = new ConfigApiClient(repository);

Deno.test("Get config", async () => {
  const config = await client.getConfig();
  assert(config);
  assertEquals(config.clientApiKey, API_KEY);
});
