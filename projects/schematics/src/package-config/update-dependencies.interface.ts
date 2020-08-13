export interface UpdateDependencies {
  dependencies: Array<string>;

  devDependencies?: Array<string | { package: string; version: string }>;
}
