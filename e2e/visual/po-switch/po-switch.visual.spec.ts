import { test, expect } from '@playwright/test';

test.describe('po-switch - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-switch-basic');
    await page.waitForSelector('po-switch');
    await expect(page.locator('sample-po-switch-basic')).toHaveScreenshot('po-switch-basic.png');
  });
});
