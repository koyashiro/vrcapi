import {
  assert,
  assertArrayIncludes,
  assertEquals,
  fail,
} from "https://deno.land/std@0.91.0/testing/asserts.ts";
import { assertExportMembers } from "./test_util.ts";
import * as env from "./env.ts";

Deno.test("export members", () => {
  const actualMembers = Object.keys(env);
  const expectedMembers = [
    "Environment",
    "getApiKeyFromEnv",
    "getAuthTokenFromEnv",
    "getUsernameFromEnv",
    "getPasswordFromEnv",
  ];

  assertExportMembers("env", actualMembers, expectedMembers);

  for (const expectedMember of expectedMembers) {
    if (!actualMembers.includes(expectedMember)) {
      fail(`env doesn't export \`${expectedMember}\` which is expected..`);
    }
  }

  for (const actualMember of actualMembers) {
    if (!expectedMembers.includes(actualMember)) {
      fail(`env export \`${actualMember}\` which is not expected.`);
    }
  }
});

Deno.test("Environment", () => {
  const expectedEnvironments = [
    "VRCAPI_API_KEY",
    "VRCAPI_AUTH_TOKEN",
    "VRCAPI_USERNAME",
    "VRCAPI_PASSWORD",
  ];

  const actualEnvironments = Object.values(env.Environment).map((e) =>
    e.toString()
  );

  for (const expectedEnvironment of expectedEnvironments) {
    if (!actualEnvironments.includes(expectedEnvironment)) {
      fail(
        `Environment doesn't has \`${expectedEnvironment}\` which is expected.`,
      );
    }
  }

  for (const actualEnvironment of actualEnvironments) {
    if (!expectedEnvironments.includes(actualEnvironment)) {
      fail(`Environment has \`${actualEnvironment}\` which is not expected.`);
    }
  }
});

Deno.test("get api key from env", () => {
  const originApiKey = Deno.env.get(env.Environment.ApiKey);

  const expectedApiKey = "expectedapikey";
  Deno.env.set(env.Environment.ApiKey, expectedApiKey);
  const actualApiKey = env.getApiKeyFromEnv();

  try {
    assertEquals(actualApiKey, expectedApiKey);
  } finally {
    if (originApiKey) {
      Deno.env.set(env.Environment.ApiKey, originApiKey);
    }
  }
});

Deno.test("get auth token from env", () => {
  const originAuthToken = Deno.env.get(env.Environment.AuthToken);

  const expectedAuthToken = "authcookie_00000000-0000-0000-0000-000000000000";
  Deno.env.set(env.Environment.AuthToken, expectedAuthToken);
  const actualAuthToken = env.getAuthTokenFromEnv();

  try {
    assertEquals(actualAuthToken, expectedAuthToken);
  } finally {
    if (originAuthToken) {
      Deno.env.set(env.Environment.AuthToken, originAuthToken);
    }
  }
});

Deno.test("get username from env", () => {
  const originUsername = Deno.env.get(env.Environment.Username);

  const expectedUsername = "username";
  Deno.env.set(env.Environment.Username, expectedUsername);
  const actualUsername = env.getUsernameFromEnv();

  try {
    assertEquals(expectedUsername, actualUsername);
  } finally {
    if (originUsername) {
      Deno.env.set(env.Environment.Username, originUsername);
    }
  }
});

Deno.test("get password from env", () => {
  const originPassword = Deno.env.get(env.Environment.Password);

  const expectedPassword = "password";
  Deno.env.set(env.Environment.Password, expectedPassword);
  const actualPassword = env.getPasswordFromEnv();

  try {
    assertEquals(expectedPassword, actualPassword);
  } finally {
    if (originPassword) {
      Deno.env.set(env.Environment.Password, originPassword);
    }
  }
});
