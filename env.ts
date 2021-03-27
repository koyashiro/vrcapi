export enum Environment {
  ApiKey = "VRCAPI_API_KEY",
  AuthToken = "VRCAPI_AUTH_TOKEN",
  Username = "VRCAPI_USERNAME",
  Password = "VRCAPI_PASSWORD",
}

class EnvError extends Error {
  constructor(environment?: string) {
    super();
    this.message = `$\`$${environment}\` is not exists.`;
  }
}

function getEnvironment(environment: Environment) {
  const value = Deno.env.get(environment);
  if (!value) {
    throw new EnvError(environment);
  }
  return value;
}

export function getApiKeyFromEnv() {
  return getEnvironment(Environment.ApiKey);
}

export function getAuthTokenFromEnv() {
  return getEnvironment(Environment.AuthToken);
}

export function getUsernameFromEnv() {
  return getEnvironment(Environment.Username);
}

export function getPasswordFromEnv() {
  return getEnvironment(Environment.Password);
}
