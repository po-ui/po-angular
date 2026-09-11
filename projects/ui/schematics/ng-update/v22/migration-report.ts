import { logging } from '@angular-devkit/core';

/**
 * Representa um Caso_Nao_Migravel identificado durante a execução da
 * Schematic_Migracao. Guarda a localização e o motivo pelo qual o trecho não
 * pôde ser migrado automaticamente, permitindo a revisão manual pelo
 * desenvolvedor.
 */
export interface MigrationWarning {
  /** Caminho do arquivo (relativo ao workspace) onde o caso foi encontrado. */
  filePath: string;
  /** Número da linha inicial do trecho não migrado. */
  line: number;
  /** Motivo pelo qual a transformação automática não foi aplicada. */
  reason: string;
}

/**
 * Relatório consolidado (Resumo_Migracao) acumulado ao longo da execução da
 * Schematic_Migracao. Contém a quantidade de arquivos analisados e alterados,
 * além da lista de Casos_Nao_Migravel encontrados.
 */
export interface MigrationReport {
  /** Quantidade total de arquivos analisados durante a varredura. */
  filesScanned: number;
  /** Quantidade total de arquivos efetivamente alterados. */
  filesChanged: number;
  /** Lista de Casos_Nao_Migravel que exigem revisão manual. */
  warnings: Array<MigrationWarning>;
}

/**
 * Cria um relatório de migração vazio, com as contagens zeradas e sem
 * advertências.
 */
export function createMigrationReport(): MigrationReport {
  return {
    filesScanned: 0,
    filesChanged: 0,
    warnings: []
  };
}

/**
 * Apresenta o Resumo_Migracao no logger da schematic ao final da execução.
 *
 * Comportamento:
 * - Sempre registra, em nível informativo, o total de arquivos analisados e
 *   alterados (Req. 9.1).
 * - Quando existem Casos_Nao_Migravel, registra em nível de alerta a lista de
 *   arquivos/linhas/motivos que exigem revisão manual, concluindo sem lançar
 *   erro (Req. 9.2, 6.5).
 * - Quando não há Casos_Nao_Migravel mas houve migração, registra mensagem
 *   informativa de sucesso total (Req. 9.3).
 * - Quando nenhuma ocorrência foi encontrada, registra mensagem informativa de
 *   "nenhuma ocorrência" (Req. 9.4).
 */
export function printMigrationSummary(report: MigrationReport, logger: logging.LoggerApi): void {
  // Req. 9.1 — total de arquivos analisados e alterados
  logger.info(
    `Resumo da migração po-gauge → po-chart: ${report.filesScanned} arquivo(s) analisado(s), ` +
      `${report.filesChanged} arquivo(s) alterado(s).`
  );

  if (report.warnings.length > 0) {
    // Req. 9.2 / 6.5 — lista de casos não migráveis, concluindo sem lançar erro
    logger.warn(`${report.warnings.length} ocorrência(s) exigem revisão manual (não foram migradas automaticamente):`);

    report.warnings.forEach(warning => {
      logger.warn(`  - ${warning.filePath}:${warning.line} — ${warning.reason}`);
    });

    return;
  }

  if (report.filesChanged > 0) {
    // Req. 9.3 — sucesso total (todas as ocorrências migradas)
    logger.info('Todas as ocorrências encontradas do po-gauge foram migradas com sucesso para po-chart.');
    return;
  }

  // Req. 9.4 — nenhuma ocorrência encontrada
  logger.info('Nenhuma ocorrência do po-gauge foi encontrada no workspace. Nenhum arquivo foi alterado.');
}
