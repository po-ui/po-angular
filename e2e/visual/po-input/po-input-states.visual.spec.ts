import { test, expect } from '@playwright/test';

test.describe('po-input - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/po-input-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic (sem propriedades)', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-input-state-basic.png');
  });

  test('label', async ({ page }) => {
    const el = page.locator('[data-testid="state-label"]');
    await expect(el).toHaveScreenshot('po-input-state-label.png');
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-input-state-label-helper.png');
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-input-state-label-help.png');
  });

  test('label + helper + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper-help"]');
    await expect(el).toHaveScreenshot('po-input-state-label-helper-help.png');
  });

  test('helper (sem label)', async ({ page }) => {
    const el = page.locator('[data-testid="state-helper"]');
    await expect(el).toHaveScreenshot('po-input-state-helper.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-input-state-disabled.png');
  });

  test('readonly', async ({ page }) => {
    const el = page.locator('[data-testid="state-readonly"]');
    await expect(el).toHaveScreenshot('po-input-state-readonly.png');
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-input-state-required.png');
  });

  test('required + errorMessage', async ({ page }) => {
    const el = page.locator('[data-testid="state-required-error"]');
    // Foca e desfoca o campo para acionar a validacao e exibir o erro
    await el.locator('input').focus();
    await el.locator('input').blur();
    await expect(el).toHaveScreenshot('po-input-state-required-error.png');
  });

  test('loading', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading"]');
    await expect(el).toHaveScreenshot('po-input-state-loading.png');
  });

  test('loading + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading-helper"]');
    await expect(el).toHaveScreenshot('po-input-state-loading-helper.png');
  });

  test('loading + label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading-label-helper"]');
    await expect(el).toHaveScreenshot('po-input-state-loading-label-helper.png');
  });
});
