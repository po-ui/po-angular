import * as readline from 'readline';

/**
 * Texto da pergunta apresentada no `ng update`. Deixa explícito que o tema novo
 * é o recomendado e que o anterior está depreciado e será removido na v24. A
 * resposta padrão (vazia) é "Não".
 */
export const DEPRECATED_THEME_QUESTION =
  'A v22 do @po-ui/ng-components traz uma nova experiência visual padrão e recomendamos utilizá-la. ' +
  'O tema anterior continua disponível como depreciado até sua remoção na v24. ' +
  'Deseja retornar ao tema anterior (depreciado)? (s/N) ';

/** Respostas afirmativas aceitas (comparação case-insensitive, já em trim). */
const AFFIRMATIVE_ANSWERS = new Set(['s', 'sim', 'y', 'yes']);

/** Interface mínima de leitura de uma linha do terminal. */
export interface LineReader {
  /** Faz a pergunta e invoca `callback` com a resposta. */
  question(query: string, callback: (answer: string) => void): void;
  /** Encerra a interface de leitura. */
  close(): void;
}

/**
 * Dependências injetáveis do prompt, com defaults de produção. Facilita o teste
 * sem depender de espionar o módulo `readline` (não gravável em CommonJS).
 */
export interface PromptDeps {
  /** Indica se há terminal interativo (`stdin` e `stdout` TTY, fora de CI). */
  isTTY: () => boolean;
  /** Cria o leitor de linha ligado ao `stdin`/`stdout`. */
  createReader: () => LineReader;
}

/**
 * Indica se há um terminal realmente interativo: o `stdin` precisa aceitar
 * resposta e o `stdout` precisa exibir a pergunta. Com a saída redirecionada
 * (`ng update ... > log.txt`) ou em CI, a pergunta ficaria invisível e a execução
 * pararia aguardando o Enter, então tratamos como execução em lote.
 */
export function isInteractiveTerminal(
  stdin: { isTTY?: boolean } = process.stdin,
  stdout: { isTTY?: boolean } = process.stdout,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const isCI = Boolean(env['CI']) && env['CI'] !== 'false' && env['CI'] !== '0';

  return Boolean(stdin.isTTY) && Boolean(stdout.isTTY) && !isCI;
}

const defaultDeps: PromptDeps = {
  isTTY: () => isInteractiveTerminal(),
  createReader: () => readline.createInterface({ input: process.stdin, output: process.stdout })
};

/**
 * Pergunta ao desenvolvedor se deseja retornar ao tema anterior (depreciado).
 *
 * Comportamento:
 * - Resposta padrão é "Não": somente respostas afirmativas explícitas
 *   (`s`/`sim`/`y`/`yes`) resolvem `true`; vazio ou qualquer outra entrada
 *   resolve `false`.
 * - Em ambiente SEM TTY (lote/CI), resolve `false` imediatamente, sem criar o
 *   leitor de linha. Isso honra o padrão "sem interação = não voltar ao tema
 *   antigo" e evita o deadlock histórico do `readline` dentro do `ng update`
 *   quando o `stdin` não é interativo.
 *
 * As dependências (`deps`) têm defaults de produção e só são informadas em teste.
 */
export function askReturnToDeprecatedTheme(deps: PromptDeps = defaultDeps): Promise<boolean> {
  // Sem TTY: não há como interagir. Mantém o padrão "Não" sem criar o leitor.
  if (!deps.isTTY()) {
    return Promise.resolve(false);
  }

  const reader = deps.createReader();

  return new Promise<boolean>(resolve => {
    reader.question(DEPRECATED_THEME_QUESTION, (answer: string) => {
      reader.close();
      resolve(AFFIRMATIVE_ANSWERS.has((answer ?? '').trim().toLowerCase()));
    });
  });
}
