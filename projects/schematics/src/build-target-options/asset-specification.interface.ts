/**
 * Each build target configuration can include an assets array that lists files or folders you want to copy as-is when building your project.
 */
export interface AssetSpecification {
  /**
   * A node-glob using input as base directory.
   */
  glob?: string;

  /**
   * A path relative to the workspace root.
   */
  input?: string;

  /**
   * A path relative to outDir (default is dist/project-name).
   */
  output?: string;

  /**
   * A list of globs to exclude.
   */
  ignore?: Array<string>;
}
