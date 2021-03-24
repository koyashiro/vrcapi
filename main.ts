import { login, loginWithAuthToken } from "./mod.ts";
import { parse } from "https://deno.land/std@0.91.0/flags/mod.ts";

const args = parse(Deno.args);

const username = args["username"];
const password = args["password"];
const code = args["code"]?.toString();
const authToken = args["auth-token"];

if (username && password) {
  const client = await login(username, password, code);
  console.log(`auth token: ${client.authCredential}`);
  Deno.exit(0);
} else if (authToken) {
  const client = await loginWithAuthToken(authToken);

  const currentUser = await client.currentUser.getCurrentUser();
  console.log(currentUser);

  const friends = await client.currentUser.getFriends();
  console.log(friends);

  const user = await client.user.getUserById(friends[0].id);
  console.log(user);
} else {
  Deno.exit(1);
}
