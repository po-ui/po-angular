import { test, expect } from '@playwright/test';

test.describe('po-textarea - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-textarea-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-textarea-state-basic.png', { maxDiffPixelRatio: 0.05 });
  });

  test('label', async ({ page }) => {
    const el = page.locator('[data-testid="state-label"]');
    await expect(el).toHaveScreenshot('po-textarea-state-label.png', { maxDiffPixelRatio: 0.05 });
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-textarea-state-label-helper.png', { maxDiffPixelRatio: 0.05 });
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-textarea-state-label-help.png', { maxDiffPixelRatio: 0.05 });
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-textarea-state-disabled.png', { maxDiffPixelRatio: 0.05 });
  });

  test('readonly', async ({ page }) => {
    const el = page.locator('[data-testid="state-readonly"]');
    await expect(el).toHaveScreenshot('po-textarea-state-readonly.png', { maxDiffPixelRatio: 0.05 });
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-textarea-state-required.png', { maxDiffPixelRatio: 0.05 });
  });

  test('required + errorMessage', async ({ page }) => {
    const el = page.locator('[data-testid="state-required-error"]');
    await el.locator('textarea').focus();
    await el.locator('textarea').blur();
    await expect(el).toHaveScreenshot('po-textarea-state-required-error.png', { maxDiffPixelRatio: 0.05 });
  });
});
