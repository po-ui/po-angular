/**
 * Creates a new generic component definition in the given or default project.
 */
export interface Schema {
  /**
   * When true, the declaring NgModule exports this component.
   */
  export?: boolean;

  /**
   * The declaring NgModule.
   */
  module?: string;

  /**
   * The name of the component.
   */
  name: string;

  /**
   * The path at which to create the component file, relative to the current workspace.
   * Default is a folder with the same name as the component in the project root.
   */
  path?: string;

  /** The prefix to apply to the generated component selector. */
  prefix?: string;

  /** The name of the project. */
  project?: string;

  /** The file extension to use for style files. */
  style?: string;

  /** When true, creates a routing module. */
  routing?: boolean;

  /** When true, does not create \"spec.ts\" test files for the app. */
  skipTests?: boolean;

  /** When true, create a component module. */
  createModule?: boolean;
}
