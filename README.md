# vrcapi

VRChat API wrapper in Deno🦕.

## Usage

```typescript
import { login } from "https://raw.githubusercontent.com/KoyashiroKohaku/vrcapi/master/mod.ts";

const username = "foo";
const password = "bar";

const client = await login(username, password);

const friends = await client.user.getFriends();
console.log(friends);
```
