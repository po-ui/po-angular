import { test, expect } from '@playwright/test';

test.describe('po-checkbox - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-checkbox-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-checkbox-state-basic.png');
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-checkbox-state-label-help.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-checkbox-state-disabled.png');
  });

  test('disabled + checked', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled-checked"]');
    await expect(el).toHaveScreenshot('po-checkbox-state-disabled-checked.png');
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-checkbox-state-required.png');
  });
});
