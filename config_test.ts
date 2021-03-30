import { assert } from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { assertExportMembers } from "./test_util.ts";
import { BASE_URL } from "./common.ts";
import { Repository } from "./repository.ts";
import * as config from "./config.ts";

Deno.test("Export members", () => {
  const expectedMembers = [
    "ConfigApi",
  ];
  const actualMembers = Object.keys(config);
  assertExportMembers("config", expectedMembers, actualMembers);
});

const repository = new Repository(BASE_URL);
const api = new config.ConfigApi(repository);

Deno.test("Get config", async () => {
  const config = await api.getConfig();
  assert(config);
  assert(config.clientApiKey);
});
