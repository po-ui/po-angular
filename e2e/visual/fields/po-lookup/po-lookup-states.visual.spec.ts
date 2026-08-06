import { test, expect } from '@playwright/test';

test.describe('po-lookup - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-lookup-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-lookup-state-basic.png');
  });

  test('label', async ({ page }) => {
    const el = page.locator('[data-testid="state-label"]');
    await expect(el).toHaveScreenshot('po-lookup-state-label.png');
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-lookup-state-label-helper.png');
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-lookup-state-label-help.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-lookup-state-disabled.png');
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-lookup-state-required.png');
  });

  test('clean', async ({ page }) => {
    const el = page.locator('[data-testid="state-clean"]');
    await expect(el).toHaveScreenshot('po-lookup-state-clean.png');
  });
});
