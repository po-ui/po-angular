import { logging } from '@angular-devkit/core';

import { createMigrationReport, MigrationReport, printMigrationSummary } from './migration-report';

describe('v22 migration-report:', () => {
  let logger: jasmine.SpyObj<logging.LoggerApi>;

  beforeEach(() => {
    logger = jasmine.createSpyObj<logging.LoggerApi>('LoggerApi', ['info', 'warn', 'error', 'debug', 'fatal']);
  });

  describe('createMigrationReport:', () => {
    it('should return a report with zeroed counters and an empty warnings list', () => {
      const report = createMigrationReport();

      expect(report.filesScanned).toBe(0);
      expect(report.filesChanged).toBe(0);
      expect(report.warnings).toEqual([]);
    });

    it('should return a new (independent) instance on each call', () => {
      const first = createMigrationReport();
      const second = createMigrationReport();

      expect(first).not.toBe(second);
      expect(first.warnings).not.toBe(second.warnings);
    });
  });

  describe('printMigrationSummary:', () => {
    it('should always log an info message with the total scanned/changed files (Req 9.1)', () => {
      const report: MigrationReport = {
        filesScanned: 5,
        filesChanged: 2,
        warnings: []
      };

      printMigrationSummary(report, logger);

      expect(logger.info).toHaveBeenCalledWith(
        'Resumo da migração po-gauge → po-chart: 5 arquivo(s) analisado(s), 2 arquivo(s) alterado(s).'
      );
    });

    describe('when there are Casos_Nao_Migravel (warnings present) (Req 9.2, 6.5):', () => {
      const report: MigrationReport = {
        filesScanned: 3,
        filesChanged: 1,
        warnings: [
          { filePath: 'src/app/a.html', line: 10, reason: 'trecho malformado' },
          { filePath: 'src/app/b.ts', line: 4, reason: 'símbolo sem equivalente' }
        ]
      };

      it('should log the info totals', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).toHaveBeenCalledWith(
          'Resumo da migração po-gauge → po-chart: 3 arquivo(s) analisado(s), 1 arquivo(s) alterado(s).'
        );
      });

      it('should log a warn header with the number of occurrences requiring manual review', () => {
        printMigrationSummary(report, logger);

        expect(logger.warn).toHaveBeenCalledWith(
          '2 ocorrência(s) exigem revisão manual (não foram migradas automaticamente):'
        );
      });

      it('should log a warn line for each warning with file/line/reason', () => {
        printMigrationSummary(report, logger);

        expect(logger.warn).toHaveBeenCalledWith('  - src/app/a.html:10 — trecho malformado');
        expect(logger.warn).toHaveBeenCalledWith('  - src/app/b.ts:4 — símbolo sem equivalente');
      });

      it('should not log the success message when warnings are present (Req 9.3)', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).not.toHaveBeenCalledWith(
          'Todas as ocorrências encontradas do po-gauge foram migradas com sucesso para po-chart.'
        );
      });

      it('should not throw even when Casos_Nao_Migravel exist (Req 6.5)', () => {
        expect(() => printMigrationSummary(report, logger)).not.toThrow();
        expect(logger.error).not.toHaveBeenCalled();
      });
    });

    describe('when there are no warnings but migration occurred (filesChanged > 0) (Req 9.3):', () => {
      const report: MigrationReport = {
        filesScanned: 4,
        filesChanged: 4,
        warnings: []
      };

      it('should log the success info message', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).toHaveBeenCalledWith(
          'Todas as ocorrências encontradas do po-gauge foram migradas com sucesso para po-chart.'
        );
      });

      it('should not log any warn message', () => {
        printMigrationSummary(report, logger);

        expect(logger.warn).not.toHaveBeenCalled();
      });

      it('should not log the "nenhuma ocorrência" message (Req 9.4)', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).not.toHaveBeenCalledWith(
          'Nenhuma ocorrência do po-gauge foi encontrada no workspace. Nenhum arquivo foi alterado.'
        );
      });
    });

    describe('when no occurrence was found (filesChanged === 0, no warnings) (Req 9.4):', () => {
      const report: MigrationReport = {
        filesScanned: 7,
        filesChanged: 0,
        warnings: []
      };

      it('should log the "nenhuma ocorrência" info message', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).toHaveBeenCalledWith(
          'Nenhuma ocorrência do po-gauge foi encontrada no workspace. Nenhum arquivo foi alterado.'
        );
      });

      it('should not log the success message (Req 9.3)', () => {
        printMigrationSummary(report, logger);

        expect(logger.info).not.toHaveBeenCalledWith(
          'Todas as ocorrências encontradas do po-gauge foram migradas com sucesso para po-chart.'
        );
      });

      it('should not log any warn message', () => {
        printMigrationSummary(report, logger);

        expect(logger.warn).not.toHaveBeenCalled();
      });
    });
  });
});
