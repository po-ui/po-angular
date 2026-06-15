/**
 * generate-dist-trees.js
 *
 * Mapeia cada subdiretório presente em `dist/` e gera um arquivo
 * `<nome-do-diretorio>.tree` contendo a lista recursiva de todos os arquivos.
 *
 * Uso:
 *   node scripts/generate-dist-trees.js [outputDir]
 *
 * - outputDir (opcional): diretório onde os arquivos .tree serão salvos.
 *   Padrão: ./dist-trees
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.resolve(__dirname, '..', 'dist');
const OUTPUT_DIR = path.resolve(process.argv[2] || path.join(__dirname, '..', 'dist-trees'));

function getAllFiles(dirPath, basePath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, basePath));
    } else {
      // Caminho relativo ao diretório base (subdiretório de dist)
      files.push(path.relative(basePath, fullPath).replace(/\\/g, '/'));
    }
  }

  return files;
}

function main() {
  if (!fs.existsSync(DIST_DIR)) {
    console.error(`Erro: diretório "dist" não encontrado em: ${DIST_DIR}`);
    process.exit(1);
  }

  // Cria o diretório de saída se não existir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const subDirs = fs.readdirSync(DIST_DIR, { withFileTypes: true }).filter(d => d.isDirectory());

  if (subDirs.length === 0) {
    console.log('Nenhum subdiretório encontrado em dist/');
    return;
  }

  for (const dir of subDirs) {
    const dirFullPath = path.join(DIST_DIR, dir.name);
    const files = getAllFiles(dirFullPath, dirFullPath).sort();
    const outputFile = path.join(OUTPUT_DIR, `${dir.name}.tree`);

    fs.writeFileSync(outputFile, files.join('\n') + '\n', 'utf-8');
    console.log(`✔ ${dir.name}.tree (${files.length} arquivos)`);
  }

  console.log(`\nArquivos .tree salvos em: ${OUTPUT_DIR}`);
}

main();
