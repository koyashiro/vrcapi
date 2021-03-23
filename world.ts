import { ApiRepository } from "./repository.ts";

export interface World {
  id: string;
  name: string;
  description: string;
  featured: boolean;
  authorId: string;
  authorName: string;
  capacity: number;
  tags: string[];
  releaseStatus: ReleaseStatus;
  imageUrl: string;
  thumbnailImageUrl: string;
  assetUrl: string;
  assetUrlObject: AssetUrlObject;
  pluginUrlObject: PluginUrlObject;
  unityPackageUrlObject: UnityPackageUrlObject;
  namespace: string;
  unityPackages: {
    id: string;
    assetUrl: string;
    assetUrlObject: AssetUrlObject[];
    pluginUrl: string;
    pluginUrlObject: PluginUrlObject[];
    unityVersion: string;
    unitySoftNumber: number;
    assetVersion: number;
    platform: string;
    created_at: Date;
  }[];
  version: number;
  organization: string;
  previewYoutubeId?: string;
  favorites: number;
  // deno-lint-ignore camelcase
  created_at: Date;
  // deno-lint-ignore camelcase
  updated_at: Date;
  publicationDate: Date;
  labsPublicationDate: string;
  visits: number;
  popularity: number;
  heat: number;
  publicOccupants: number;
  privateOccupants: number;
  occupants: number;
  instances: Instance[];
}

export interface LimitedWorld {
  id: string;
  name: string;
  authorId: string;
  authorName: string;
  capacity: number;
  imageUrl: string;
  thumbnailImageUrl: string;
  releaseStatus: ReleaseStatus;
  organization: string;
  tags: string[];
  favorites: number;
  // deno-lint-ignore camelcase
  created_at: Date;
  // deno-lint-ignore camelcase
  updated_at: Date;
  publicationDate: Date;
  labsPublicationDate: string;
  unityPackages: {
    platform: string;
    unityVersion: string;
  }[];
  popularity: number;
  heat: number;
  occupants: number;
}

export interface WorldMetadata {
  id: string;
  // deno-lint-ignore no-explicit-any
  metadata: any;
}

// deno-lint-ignore no-empty-interface
interface AssetUrlObject {}

// deno-lint-ignore no-empty-interface
interface PluginUrlObject {}

// deno-lint-ignore no-empty-interface
interface UnityPackageUrlObject {}

type Instance = [instanceId: string, count: number];

enum ReleaseStatus {
  Public = "public",
  Private = "private",
  Hidden = "hidden",
}

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
