import { test, expect } from '@playwright/test';

test.describe('po-number - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-number-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-number-state-basic.png');
  });

  test('label', async ({ page }) => {
    const el = page.locator('[data-testid="state-label"]');
    await expect(el).toHaveScreenshot('po-number-state-label.png');
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-number-state-label-helper.png');
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-number-state-label-help.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-number-state-disabled.png');
  });

  test('readonly', async ({ page }) => {
    const el = page.locator('[data-testid="state-readonly"]');
    await expect(el).toHaveScreenshot('po-number-state-readonly.png');
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-number-state-required.png');
  });

  test('required + errorMessage', async ({ page }) => {
    const el = page.locator('[data-testid="state-required-error"]');
    await el.locator('input').focus();
    await el.locator('input').blur();
    await expect(el).toHaveScreenshot('po-number-state-required-error.png');
  });

  test('loading', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading"]');
    await expect(el).toHaveScreenshot('po-number-state-loading.png');
  });

  test('loading + label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading-label-helper"]');
    await expect(el).toHaveScreenshot('po-number-state-loading-label-helper.png');
  });
});
