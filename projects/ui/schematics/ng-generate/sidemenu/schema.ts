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

  /**
   * The file naming convention to use for generated files.
   *
   * - `2016`: classic Angular Style Guide suffixes (e.g. `app.component.ts`).
   * - `2025`: current Angular convention without type suffixes (e.g. `app.ts`).
   *
   * When omitted, the convention already used by the project is auto-detected.
   */
  fileNameStyleGuide?: '2016' | '2025';
}
