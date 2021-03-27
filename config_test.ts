import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { assertExportMembers } from "./test_util.ts";
import { BASE_URL } from "./common.ts";
import { VRChatApiRepository } from "./repository.ts";
import * as config from "./config.ts";

const expectedMembers = [
  "ConfigApiClient",
];
const actualMembers = Object.keys(config);

Deno.test("Export members", () => {
  assertExportMembers("config", expectedMembers, actualMembers);
});

const repository = new VRChatApiRepository(BASE_URL);
const client = new config.ConfigApiClient(repository);

Deno.test("Get config", async () => {
  const config = await client.getConfig();
  assert(config);
  assert(config.clientApiKey);
});
