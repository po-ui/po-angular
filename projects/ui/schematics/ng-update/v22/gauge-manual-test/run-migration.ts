/**
 * Script utilitário para testar manualmente a migração do po-gauge.
 *
 * Uso:
 *   npx ts-node --project tsconfig.json run-migration.ts
 *
 * Ou via tsx (mais rápido, sem compilar):
 *   npx tsx run-migration.ts
 *
 * O script lê todos os arquivos .html e .ts desta pasta (exceto ele mesmo),
 * aplica a migração correspondente e grava o resultado na pasta "output/".
 */
import * as fs from 'fs';
import * as path from 'path';

import { migrateHtmlContent } from '../gauge-html-migration';
import { migrateTypeScriptContent } from '../gauge-ts-migration';
import { MigrationWarning } from '../migration-report';

const DIR = __dirname;
const OUTPUT_DIR = path.join(DIR, 'output');

function ensureOutputDir(): void {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

function run(): void {
  ensureOutputDir();

  const files = fs.readdirSync(DIR).filter(f => {
    // Ignora este próprio script e a pasta de output
    if (f === 'run-migration.ts' || f === 'output') return false;
    return f.endsWith('.html') || f.endsWith('.ts');
  });

  if (files.length === 0) {
    console.log('Nenhum arquivo .html ou .ts encontrado para migrar.');
    return;
  }

  let totalChanged = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const filePath = path.join(DIR, file);
    const source = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(file);

    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📄 ${file}`);

    if (ext === '.html') {
      const result = migrateHtmlContent(source);
      fs.writeFileSync(path.join(OUTPUT_DIR, file), result.content, 'utf-8');

      if (result.changed) {
        totalChanged++;
        console.log('  ✅ Migrado com sucesso');
      } else {
        console.log('  ⏭️  Sem alterações');
      }

      if (result.warnings.length > 0) {
        totalWarnings += result.warnings.length;
        result.warnings.forEach(w => {
          console.log(`  ⚠️  Linha ${w.line}: ${w.reason}`);
        });
      }
    } else if (ext === '.ts') {
      // Primeiro aplica a migração TypeScript (imports/referências).
      const tsResult = migrateTypeScriptContent(source, true);
      // Depois aplica a migração HTML em templates inline (template: `...`).
      const withInlineTemplates = migrateInlineTemplates(tsResult.content);

      const finalContent = withInlineTemplates.content;
      const changed = tsResult.changed || withInlineTemplates.changed;

      fs.writeFileSync(path.join(OUTPUT_DIR, file), finalContent, 'utf-8');

      if (changed) {
        totalChanged++;
        console.log('  ✅ Migrado com sucesso');
      } else {
        console.log('  ⏭️  Sem alterações');
      }

      const allWarnings = [...tsResult.warnings, ...withInlineTemplates.warnings];
      if (allWarnings.length > 0) {
        totalWarnings += allWarnings.length;
        allWarnings.forEach(w => {
          console.log(`  ⚠️  Linha ${w.line}: ${w.reason}`);
        });
      }
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`\n📊 Resumo:`);
  console.log(`   Arquivos processados: ${files.length}`);
  console.log(`   Arquivos alterados:   ${totalChanged}`);
  console.log(`   Warnings:            ${totalWarnings}`);
  console.log(`\n📁 Resultados gravados em: ${OUTPUT_DIR}`);
}

/**
 * Procura templates inline (template: `...` ou template: '...' ou template: "...")
 * dentro de um arquivo .ts e aplica migrateHtmlContent em cada um encontrado.
 */
function migrateInlineTemplates(source: string): {
  content: string;
  changed: boolean;
  warnings: Array<MigrationWarning>;
} {
  const warnings: Array<MigrationWarning> = [];
  let changed = false;

  // Regex para encontrar template: `...` (backtick — mais comum para multiline)
  const templateRegex = /template\s*:\s*`([^`]*)`/g;
  let result = source;

  // Processa templates com backticks
  result = result.replace(templateRegex, (match, templateContent: string) => {
    const migrated = migrateHtmlContent(templateContent);
    if (migrated.changed) {
      changed = true;
      warnings.push(...migrated.warnings);
      return match.replace(templateContent, migrated.content);
    }
    return match;
  });

  // Processa templates com aspas simples (single-line)
  const singleQuoteRegex = /template\s*:\s*'([^']*)'/g;
  result = result.replace(singleQuoteRegex, (match, templateContent: string) => {
    const migrated = migrateHtmlContent(templateContent);
    if (migrated.changed) {
      changed = true;
      warnings.push(...migrated.warnings);
      return match.replace(templateContent, migrated.content);
    }
    return match;
  });

  // Processa templates com aspas duplas (single-line)
  const doubleQuoteRegex = /template\s*:\s*"([^"]*)"/g;
  result = result.replace(doubleQuoteRegex, (match, templateContent: string) => {
    const migrated = migrateHtmlContent(templateContent);
    if (migrated.changed) {
      changed = true;
      warnings.push(...migrated.warnings);
      return match.replace(templateContent, migrated.content);
    }
    return match;
  });

  return { content: result, changed, warnings };
}

run();
