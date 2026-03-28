import * as fs from 'node:fs';
import * as path from 'node:path';
import type {
  ComponentDoc,
  ComponentProperty,
  ComponentEvent,
  CssToken,
  ComponentSample,
  ComponentMethod,
  GuideDoc,
  ParsedRepo
} from './types.js';

/**
 * Resolve the po-angular repo root path.
 * When running inside the monorepo (projects/mcp/build/), resolves to the repo root.
 * Accepts an explicit override via PO_ANGULAR_PATH env var.
 */
export function getRepoRoot(): string {
  return process.env['PO_ANGULAR_PATH'] || path.resolve(__dirname, '../../..');
}

/**
 * Parse all component documentation and guides from the PO Angular repository.
 */
export function parseRepo(repoRoot?: string): ParsedRepo {
  const root = repoRoot || getRepoRoot();
  const components: ComponentDoc[] = [];

  // Parse UI components
  const uiComponentsDir = path.join(root, 'projects/ui/src/lib/components');
  if (fs.existsSync(uiComponentsDir)) {
    components.push(...parseComponentsDir(uiComponentsDir, 'ui'));
  }

  // Parse field components (nested inside po-field)
  const fieldDir = path.join(uiComponentsDir, 'po-field');
  if (fs.existsSync(fieldDir)) {
    components.push(...parseComponentsDir(fieldDir, 'ui/field'));
  }

  // Parse template components
  const templatesDir = path.join(root, 'projects/templates/src/lib/components');
  if (fs.existsSync(templatesDir)) {
    components.push(...parseComponentsDir(templatesDir, 'templates'));
  }

  // Parse guides
  const guides = parseGuides(root);

  return { components, guides };
}

/**
 * Scan a directory for component subdirectories and parse each one.
 */
function parseComponentsDir(dir: string, library: string): ComponentDoc[] {
  const components: ComponentDoc[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (!entry.name.startsWith('po-')) continue;
    // Skip the po-field container itself since we parse its children
    if (entry.name === 'po-field') continue;

    const componentDir = path.join(dir, entry.name);
    const doc = parseComponent(componentDir, entry.name, library);
    if (doc) {
      components.push(doc);
    }
  }

  return components;
}

/**
 * Parse a single component directory.
 */
function parseComponent(componentDir: string, name: string, library: string): ComponentDoc | null {
  // Find the base component file (contains the main documentation)
  const baseFile = findBaseFile(componentDir, name);
  if (!baseFile) return null;

  const content = fs.readFileSync(baseFile, 'utf-8');

  // Extract the class-level JSDoc (component description + CSS tokens)
  const classDoc = extractClassDoc(content);
  if (!classDoc.description && !classDoc.cssTokens.length) return null;

  // Extract properties (@Input)
  const properties = extractProperties(content);

  // Extract events (@Output)
  const events = extractEvents(content);

  // Extract public methods
  const methods = extractMethods(content);

  // Find selector from the concrete component file
  const selector = findSelector(componentDir, name) || name;

  // Find samples
  const samples = parseSamples(componentDir, name);

  // Determine category
  const category = determineCategory(name, library);

  return {
    name,
    selector,
    description: classDoc.description,
    library,
    category,
    properties,
    events,
    cssTokens: classDoc.cssTokens,
    samples,
    methods
  };
}

/**
 * Find the base component file that contains the main documentation.
 */
function findBaseFile(componentDir: string, name: string): string | null {
  // Try *-base.component.ts first (most common pattern)
  const baseName = `${name}-base.component.ts`;
  const basePath = path.join(componentDir, baseName);
  if (fs.existsSync(basePath)) return basePath;

  // Try the component.ts directly
  const componentName = `${name}.component.ts`;
  const componentPath = path.join(componentDir, componentName);
  if (fs.existsSync(componentPath)) return componentPath;

  return null;
}

/**
 * Find the selector from the concrete @Component decorator.
 */
function findSelector(componentDir: string, name: string): string | null {
  const componentFile = path.join(componentDir, `${name}.component.ts`);
  if (!fs.existsSync(componentFile)) return null;

  const content = fs.readFileSync(componentFile, 'utf-8');
  const selectorMatch = content.match(/selector:\s*'([^']+)'/);
  return selectorMatch ? selectorMatch[1] : null;
}

/**
 * Extract the class-level JSDoc block (description and CSS tokens).
 */
function extractClassDoc(content: string): { description: string; cssTokens: CssToken[] } {
  // Find the main JSDoc block before @Component or @Directive
  const classDocRegex = /\/\*\*\s*\n\s*\*\s*@description\s*\n([\s\S]*?)\*\//g;
  let match: RegExpExecArray | null;
  let bestDoc = '';
  const cssTokens: CssToken[] = [];

  while ((match = classDocRegex.exec(content)) !== null) {
    const docBlock = match[1];
    // This is the class-level doc if it's before the class declaration
    const posAfterDoc = match.index + match[0].length;
    const nextContent = content.substring(posAfterDoc, posAfterDoc + 200);
    if (nextContent.match(/@(Component|Directive)/)) {
      bestDoc = docBlock;
      break;
    }
    // Keep the largest doc as fallback
    if (docBlock.length > bestDoc.length) {
      bestDoc = docBlock;
    }
  }

  if (!bestDoc) return { description: '', cssTokens };

  // Clean up the doc text
  const lines = bestDoc.split('\n').map(line => {
    return line.replace(/^\s*\*\s?/, '');
  });

  let description = '';
  let inTokenTable = false;
  let currentCategory = 'Default';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect CSS token table
    if (trimmed.includes('Tokens customizáveis') || trimmed.includes('tokens (CSS)')) {
      inTokenTable = true;
      continue;
    }

    if (inTokenTable) {
      // Parse token table rows
      if (trimmed.startsWith('|') && !trimmed.includes('---')) {
        const cells = trimmed.split('|').map(c => c.trim()).filter(Boolean);
        if (cells.length >= 3) {
          const prop = cells[0].replace(/&nbsp;/g, '').replace(/\*\*/g, '').trim();
          const desc = cells[1].replace(/&nbsp;/g, '').trim();
          const defaultVal = cells[2].replace(/&nbsp;/g, '').trim();

          // Check if this is a category header
          if (prop.startsWith('**') || (!prop.startsWith('`') && !prop.startsWith('-') && desc === '' && defaultVal === '')) {
            currentCategory = prop.replace(/\*\*/g, '').trim();
            continue;
          }

          // Skip table header row
          if (prop === 'Propriedade' || prop === 'Property') continue;

          if (prop.startsWith('`') || prop.startsWith('-')) {
            cssTokens.push({
              property: prop.replace(/`/g, '').trim(),
              description: desc,
              defaultValue: defaultVal.replace(/`/g, '').trim(),
              category: currentCategory
            });
          }
        }
      }
    } else {
      // Build description text
      if (trimmed && !trimmed.startsWith('@')) {
        description += (description ? '\n' : '') + trimmed;
      }
    }
  }

  return { description: description.trim(), cssTokens };
}

/**
 * Extract @Input properties from the component source.
 */
function extractProperties(content: string): ComponentProperty[] {
  const properties: ComponentProperty[] = [];

  // Pattern 1: @Input('p-alias') with JSDoc
  const inputPattern = /\/\*\*\s*([\s\S]*?)\*\/\s*(?:@HostBinding\([^)]*\)\s*)?@Input\(\s*(?:\{[^}]*alias:\s*'([^']+)'[^}]*\}|'([^']+)')\s*\)\s*(?:set\s+)?(\w+)(?:\s*[:(])/g;

  let match: RegExpExecArray | null;
  while ((match = inputPattern.exec(content)) !== null) {
    const docBlock = match[1];
    const alias = match[2] || match[3];
    const propName = match[4];

    const doc = parsePropertyDoc(docBlock);

    properties.push({
      name: propName,
      alias: alias || propName,
      type: doc.type || 'any',
      description: doc.description,
      required: doc.required,
      default: doc.default,
      deprecated: doc.deprecated,
      optional: doc.optional
    });
  }

  // Pattern 2: readonly prop = input<Type>(default, { alias: 'p-xxx' })
  const signalPattern = /\/\*\*\s*([\s\S]*?)\*\/\s*(?:readonly\s+)?(\w+)\s*=\s*input<([^>]+)>\([^,]*,\s*\{\s*alias:\s*'([^']+)'/g;

  while ((match = signalPattern.exec(content)) !== null) {
    const docBlock = match[1];
    const propName = match[2];
    const type = match[3];
    const alias = match[4];

    const doc = parsePropertyDoc(docBlock);

    // Avoid duplicates
    if (!properties.find(p => p.name === propName)) {
      properties.push({
        name: propName,
        alias,
        type,
        description: doc.description,
        required: doc.required,
        default: doc.default,
        deprecated: doc.deprecated,
        optional: doc.optional
      });
    }
  }

  // Pattern 3: @Input('p-xxx') with transform, inline
  const inlineInputPattern = /\/\*\*\s*([\s\S]*?)\*\/\s*@Input\(\s*\{\s*alias:\s*'([^']+)'[^}]*\}\s*\)\s*(\w+)/g;

  while ((match = inlineInputPattern.exec(content)) !== null) {
    const docBlock = match[1];
    const alias = match[2];
    const propName = match[3];

    // Avoid duplicates
    if (!properties.find(p => p.name === propName)) {
      const doc = parsePropertyDoc(docBlock);
      properties.push({
        name: propName,
        alias,
        type: doc.type || 'boolean',
        description: doc.description,
        required: doc.required,
        default: doc.default,
        deprecated: doc.deprecated,
        optional: doc.optional
      });
    }
  }

  return properties;
}

/**
 * Parse JSDoc block for property documentation.
 */
function parsePropertyDoc(docBlock: string): {
  description: string;
  type: string;
  required: boolean;
  default?: string;
  deprecated?: string;
  optional: boolean;
} {
  const lines = docBlock.split('\n').map(l => l.replace(/^\s*\*\s?/, '').trim());

  let description = '';
  let type = '';
  let required = false;
  let defaultValue: string | undefined;
  let deprecated: string | undefined;
  let optional = false;

  for (const line of lines) {
    if (line.startsWith('@Input')) continue;
    if (line.startsWith('@optional')) {
      optional = true;
      continue;
    }
    if (line.startsWith('@description')) continue;
    if (line.startsWith('@default')) {
      defaultValue = line.replace('@default', '').replace(/`/g, '').trim();
      continue;
    }
    if (line.startsWith('@deprecated')) {
      deprecated = line.replace('@deprecated', '').trim();
      continue;
    }
    if (line.startsWith('@type')) {
      type = line.replace('@type', '').trim();
      continue;
    }
    if (line && !line.startsWith('@')) {
      description += (description ? ' ' : '') + line;
    }
  }

  // Infer required from description
  if (description.toLowerCase().includes('obrigatóri') || description.toLowerCase().includes('required')) {
    required = true;
  }

  return { description: description.trim(), type, required, default: defaultValue, deprecated, optional };
}

/**
 * Extract @Output events from component source.
 */
function extractEvents(content: string): ComponentEvent[] {
  const events: ComponentEvent[] = [];

  // Pattern: JSDoc + @Output('p-xxx')
  const outputPattern = /\/\*\*\s*([\s\S]*?)\*\/\s*@Output\('([^']+)'\)\s*(\w+)/g;

  let match: RegExpExecArray | null;
  while ((match = outputPattern.exec(content)) !== null) {
    const docBlock = match[1];
    const alias = match[2];
    const name = match[3];

    const description = docBlock
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, '').trim())
      .filter(l => l && !l.startsWith('@'))
      .join(' ')
      .trim();

    events.push({ name, alias, description });
  }

  // Single line comment + @Output pattern
  const singleLinePattern = /\/\*\*\s*([^*]*(?:\*(?!\/)[^*]*)*)\s*\*\/\s*@Output\('([^']+)'\)\s*(\w+)/g;

  while ((match = singleLinePattern.exec(content)) !== null) {
    const alias = match[2];
    const name = match[3];

    // Avoid duplicates
    if (!events.find(e => e.name === name)) {
      const description = match[1].replace(/\*/g, '').trim();
      events.push({ name, alias, description });
    }
  }

  return events;
}

/**
 * Extract public methods documentation.
 */
function extractMethods(content: string): ComponentMethod[] {
  const methods: ComponentMethod[] = [];

  // Pattern: JSDoc + public method (or method without private/protected)
  const methodPattern = /\/\*\*\s*([\s\S]*?)\*\/\s*(?:public\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\w+)?\s*\{/g;

  let match: RegExpExecArray | null;
  while ((match = methodPattern.exec(content)) !== null) {
    const docBlock = match[1];
    const name = match[2];

    // Skip lifecycle hooks, getters/setters, private methods
    if (name.startsWith('ng') || name === 'constructor' || name.startsWith('_')) continue;
    if (docBlock.includes('@Input') || docBlock.includes('@Output')) continue;

    const description = docBlock
      .split('\n')
      .map(l => l.replace(/^\s*\*\s?/, '').trim())
      .filter(l => l && !l.startsWith('@'))
      .join(' ')
      .trim();

    if (description) {
      methods.push({ name, description, isPublic: true });
    }
  }

  return methods;
}

/**
 * Parse sample files for a component.
 */
function parseSamples(componentDir: string, componentName: string): ComponentSample[] {
  const samples: ComponentSample[] = [];

  // Check the concrete component file for @example annotations
  const componentFile = path.join(componentDir, `${componentName}.component.ts`);
  if (!fs.existsSync(componentFile)) return samples;

  const content = fs.readFileSync(componentFile, 'utf-8');

  // Extract @example blocks
  const exampleRegex = /<example\s+name="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/example>/g;
  let match: RegExpExecArray | null;

  while ((match = exampleRegex.exec(content)) !== null) {
    const name = match[1];
    const title = match[2];
    const filesBlock = match[3];

    // Extract file references
    const fileRegex = /<file\s+name="([^"]+)">/g;
    let fileMatch: RegExpExecArray | null;
    const files: Array<{ name: string; content: string }> = [];

    while ((fileMatch = fileRegex.exec(filesBlock)) !== null) {
      const fileName = fileMatch[1];
      const samplesDir = path.join(componentDir, 'samples');
      const filePath = path.join(samplesDir, fileName);
      if (fs.existsSync(filePath)) {
        files.push({
          name: fileName,
          content: fs.readFileSync(filePath, 'utf-8')
        });
      }
    }

    samples.push({ name, title, files });
  }

  return samples;
}

/**
 * Determine component category based on its name and library.
 */
function determineCategory(name: string, library: string): string {
  if (library === 'templates') return 'Templates';

  const fieldComponents = [
    'po-checkbox', 'po-checkbox-group', 'po-combo', 'po-datepicker',
    'po-datepicker-range', 'po-decimal', 'po-email', 'po-input',
    'po-login', 'po-lookup', 'po-multiselect', 'po-number',
    'po-password', 'po-radio', 'po-radio-group', 'po-rich-text',
    'po-select', 'po-switch', 'po-textarea', 'po-upload', 'po-url'
  ];
  if (fieldComponents.includes(name)) return 'Fields';

  const layoutComponents = [
    'po-page', 'po-modal', 'po-container', 'po-divider',
    'po-widget', 'po-accordion', 'po-stepper', 'po-tabs',
    'po-overlay', 'po-skeleton'
  ];
  if (layoutComponents.includes(name)) return 'Layout';

  const navigationComponents = [
    'po-menu', 'po-menu-panel', 'po-navbar', 'po-toolbar',
    'po-breadcrumb', 'po-header'
  ];
  if (navigationComponents.includes(name)) return 'Navigation';

  const dataComponents = ['po-table', 'po-list-view', 'po-grid', 'po-chart', 'po-gauge'];
  if (dataComponents.includes(name)) return 'Data';

  const feedbackComponents = ['po-loading', 'po-toaster', 'po-progress', 'po-tag', 'po-badge'];
  if (feedbackComponents.includes(name)) return 'Feedback';

  return 'General';
}

/**
 * Parse documentation guides from the docs/guides directory.
 */
function parseGuides(repoRoot: string): GuideDoc[] {
  const guides: GuideDoc[] = [];
  const guidesDir = path.join(repoRoot, 'docs/guides');

  if (!fs.existsSync(guidesDir)) return guides;

  const files = fs.readdirSync(guidesDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(guidesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract label from the comment at the top
    const labelMatch = content.match(/\[comment\]:\s*#\s*\(@label\s+(.+)\)/);
    const label = labelMatch ? labelMatch[1] : file.replace('.md', '').replace(/-/g, ' ');

    guides.push({
      name: file.replace('.md', ''),
      label,
      fileName: file,
      content
    });
  }

  return guides;
}
