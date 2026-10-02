/** Converte o caminho de um arquivo na unidade a que ele pertence (componente, serviço, util...). */

const path = require('path');

const toPosix = filePath => filePath.split(path.sep).join('/');

const isAggregatorFile = name => name === 'index.ts' || name.endsWith('.module.ts');

// Ex.: components/po-field/po-combo/po-combo.component.ts → components/po-field/po-combo
function unitOf(relPath) {
  const seg = relPath.split('/');
  if (seg.length === 1) {
    return 'root';
  }

  if (seg[0] === 'components') {
    if (seg.length === 2) {
      return 'components';
    }
    if (seg[1] === 'po-field') {
      return seg.length === 3 ? 'components/po-field' : `components/po-field/${seg[2]}`;
    }
    return `components/${seg[1]}`;
  }

  if (seg.length === 2) {
    return isAggregatorFile(seg[1]) ? seg[0] : `${seg[0]}/${seg[1].replace(/(\.spec)?\.ts$/, '')}`;
  }
  return `${seg[0]}/${seg[1]}`;
}

const displayName = unit => (unit.startsWith('components/') ? unit.split('/').pop() : unit);

// index.ts e módulos importam tudo; se propagassem, qualquer mudança atingiria a lib inteira.
const isSink = file => path.basename(file) === 'index.ts' || file.endsWith('.module.ts') || !file.includes('/');

module.exports = { toPosix, unitOf, displayName, isSink };
