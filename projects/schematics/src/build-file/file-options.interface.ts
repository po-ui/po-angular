/**
 * Creates a new generic file definition in the given or default project.
 */
export interface FileOptions {
  /**
   * The name of the file.
   */
  name: string;

  /**
   * The path at which to create the file, relative to the current workspace.
   * Default is a folder with the same name as the file in the project root.
   */
  path?: string;

  /** The name of the project. */
  project?: string;
}
