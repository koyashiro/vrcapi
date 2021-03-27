import { fail } from "https://deno.land/std@0.91.0/testing/asserts.ts";

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
