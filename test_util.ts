import { fail } from "https://deno.land/std@0.91.0/testing/asserts.ts";

export const TEST_USER = {
  ID: 'usr_81af6e45-e8f3-4bef-b693-44bbc261e4bd',
  NAME: 'nullo_neg'
}

export function assertExportMembers(
  moduleName: string,
  actualMembers: string[],
  expectedMembers: string[],
) {
  for (const expectedMember of expectedMembers) {
    if (!actualMembers.includes(expectedMember)) {
      fail(
        `\`${moduleName}\` doesn't export \`${expectedMember}\` which is expected.`,
      );
    }
  }

  for (const actualMember of actualMembers) {
    if (!expectedMembers.includes(actualMember)) {
      fail(
        `\`${moduleName}\` export \`${actualMember}\` which is not expected.`,
      );
    }
  }
}
