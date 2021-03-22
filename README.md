# vrcapi

## Usage

```typescript
import { login } from "https://github.com/KoyashiroKohaku/vrcapi/blob/master/src/mod.ts";

const username = "foo";
const password = "bar";

const client = await login(username, password);

const friends = client.user.getFriends();
```

## Sample

### Login

```sh
$ deno run --allow-net main.ts --username <username> --password <password> [ --code <code> ]
```

```
auth token: authcookie_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### Get API (with auth token)

```sh
$ deno run --allow-net main.ts --auth-token <authtoken>
```
