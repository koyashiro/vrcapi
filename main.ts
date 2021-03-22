import { VrcApi } from "./src/mod.ts";
import { CurrentUser, User } from "./src/mod.ts";
import { parse } from "https://deno.land/std@0.91.0/flags/mod.ts";

const vrcApi = new VrcApi();
const args = parse(Deno.args);

const username = args["username"];
const password = args["password"];
const code = args["code"];
const authToken = args["auth-token"];

if (username && password) {
  const result = await vrcApi.login(username, password, code);
  if (!result) {
    console.log("Login failed");
    Deno.exit(1);
  }
} else if (authToken) {
  const result = await vrcApi.loadAuthToken(authToken);
  if (!result) {
    console.log("Load failed");
    Deno.exit(1);
  }
} else {
  Deno.exit(1);
}

const currentUser: CurrentUser = await vrcApi.getCurrentUser();
console.log(currentUser);

const friends: User[] = await vrcApi.getFriends();
console.log(friends);

const user = await vrcApi.getUser(friends[0].id);
console.log(user);
