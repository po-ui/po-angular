import { test, expect } from '@playwright/test';

test.describe('po-switch - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-switch-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-switch-state-basic.png');
  });

  test('label-on / label-off', async ({ page }) => {
    const el = page.locator('[data-testid="state-labels"]');
    await expect(el).toHaveScreenshot('po-switch-state-labels.png');
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-switch-state-label-helper.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-switch-state-disabled.png');
  });

  test('disabled + checked', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled-checked"]');
    await expect(el).toHaveScreenshot('po-switch-state-disabled-checked.png');
  });

  test('loading', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading"]');
    await expect(el).toHaveScreenshot('po-switch-state-loading.png');
  });
});
