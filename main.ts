import { login } from "./src/vrcapi.ts";
import { getUser, VrcApiSession } from "./src/vrcapi.ts";

const username = "";
const password = "";
const code = "";

let session: VrcApiSession;

try {
  session = await login(username, password, code);
  console.log(session);
} catch (e) {
  console.log(e);
  Deno.exit(-1);
}

try {
  const user = await getUser(session);
  console.log(user);
} catch (e) {
  console.log(e);
  Deno.exit(-1);
}
