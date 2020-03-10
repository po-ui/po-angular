/**
 * Creates a new generic component definition in the given or default project.
 */
export interface Schema {
  /** The name of application. */
  appName: string;

  /** The name of the project. */
  project?: string;

  /** The file extension to use for style files. */
  style?: string;

  /** When true, does not create \"spec.ts\" test files for the app. */
  skipTests?: boolean;
}
