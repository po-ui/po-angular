import { test, expect } from '@playwright/test';

test.describe('po-input - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-input-basic');
    await page.waitForSelector('po-input');
    await expect(page.locator('sample-po-input-basic')).toHaveScreenshot('po-input-basic.png');
  });
});
