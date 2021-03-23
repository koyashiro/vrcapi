export interface ApiRepository {
  get<T>(relativeUrl: string): Promise<T>;

  getWithBasic<T>(
    relativeUrl: string,
    apiKey: string,
    username: string,
    password: string,
  ): Promise<[value: T, authToken: string]>;

  postWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
    body: string,
  ): Promise<T>;

  getWithAuthToken<T>(
    relativeUrl: string,
    apiKey: string,
    authToken: string,
  ): Promise<T>;
}
