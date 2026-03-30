export interface LlmsEntry {
  name: string;
  slug: string;
  url: string;
  description: string;
  section: string;
}

const SECTION_MAP: Record<string, string> = {
  'componentes e diretivas': 'components',
  'serviços': 'services',
  'interfaces e modelos': 'interfaces',
  'enums': 'enums',
  'guias': 'guides'
};

// Matches: - [Name](URL): description  OR  - [Name](URL)
const ENTRY_RE = /^- \[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?$/;

export function parseLlmsTxt(text: string): LlmsEntry[] {
  const entries: LlmsEntry[] = [];
  let currentSection = 'unknown';

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();

    if (line.startsWith('## ')) {
      const label = line.slice(3).toLowerCase().trim();
      currentSection = SECTION_MAP[label] ?? label;
      continue;
    }

    const match = ENTRY_RE.exec(line);
    if (!match) continue;

    const [, name, url, description = ''] = match;

    // Extract slug from URL path:
    // https://po-ui.io/llms-generated/po-button.md  → po-button
    // https://po-ui.io/guides/getting-started        → getting-started
    const lastSegment = url.split('/').pop() ?? '';
    const slug = lastSegment.endsWith('.md') ? lastSegment.slice(0, -3) : lastSegment;

    entries.push({
      name,
      slug,
      url,
      description: description.trim(),
      section: currentSection
    });
  }

  return entries;
}
