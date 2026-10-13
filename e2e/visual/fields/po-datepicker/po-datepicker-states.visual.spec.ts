import { test, expect } from '@playwright/test';

test.describe('po-datepicker - visual regression por estado', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/visual/fields/po-datepicker-states');
    await page.waitForSelector('[data-testid="state-basic"]');
  });

  test('basic', async ({ page }) => {
    const el = page.locator('[data-testid="state-basic"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-basic.png');
  });

  test('label', async ({ page }) => {
    const el = page.locator('[data-testid="state-label"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-label.png');
  });

  test('label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-helper"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-label-helper.png');
  });

  test('label + help-text', async ({ page }) => {
    const el = page.locator('[data-testid="state-label-help"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-label-help.png');
  });

  test('disabled', async ({ page }) => {
    const el = page.locator('[data-testid="state-disabled"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-disabled.png');
  });

  test('readonly', async ({ page }) => {
    const el = page.locator('[data-testid="state-readonly"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-readonly.png');
  });

  test('required', async ({ page }) => {
    const el = page.locator('[data-testid="state-required"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-required.png');
  });

  test('required + errorMessage', async ({ page }) => {
    const el = page.locator('[data-testid="state-required-error"]');
    await el.locator('input').first().focus();
    await el.locator('input').first().blur();
    await expect(el).toHaveScreenshot('po-datepicker-state-required-error.png');
  });

  test('loading', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-loading.png');
  });

  test('loading + label + helper', async ({ page }) => {
    const el = page.locator('[data-testid="state-loading-label-helper"]');
    await expect(el).toHaveScreenshot('po-datepicker-state-loading-label-helper.png');
  });
});
