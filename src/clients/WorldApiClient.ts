import { ApiRepository } from "../repositories/ApiRepository.ts";
import { LimitedWorld, World, WorldMetadata } from "../interfaces/World.ts";

export class WorldApiClient {
  private readonly _apiKey: string;
  private readonly _authToken: string;
  private readonly _repository: ApiRepository;

  constructor(
    apiKey: string,
    authToken: string,
    repository: ApiRepository,
  ) {
    this._apiKey = apiKey;
    this._authToken = authToken;
    this._repository = repository;
  }

  getWorldById(id: string): Promise<World> {
    return this._repository.getWithAuthToken<World>(
      `worlds/${id}`,
      this._apiKey,
      this._authToken,
    );
  }

  getAnyWorlds(): Promise<LimitedWorld[]> {
    return this._repository.getWithAuthToken<LimitedWorld[]>(
      "worlds",
      this._apiKey,
      this._authToken,
    );
  }

  getActiveWorlds(): Promise<LimitedWorld[]> {
    return this._repository.getWithAuthToken<LimitedWorld[]>(
      "worlds/active",
      this._apiKey,
      this._authToken,
    );
  }

  getRecentWorlds(): Promise<LimitedWorld[]> {
    return this._repository.getWithAuthToken<LimitedWorld[]>(
      "worlds/recent",
      this._apiKey,
      this._authToken,
    );
  }

  getFavoriteWorlds(): Promise<LimitedWorld[]> {
    return this._repository.getWithAuthToken<LimitedWorld[]>(
      "worlds/favorites",
      this._apiKey,
      this._authToken,
    );
  }

  getWorldMetadataById(id: string): Promise<WorldMetadata> {
    return this._repository.getWithAuthToken<WorldMetadata>(
      `worlds/${id}/metadata`,
      this._apiKey,
      this._authToken,
    );
  }
}
