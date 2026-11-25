import { test, expect } from '@playwright/test';

test.describe('po-select - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-select-basic');
    await page.waitForSelector('po-select');
    await expect(page.locator('sample-po-select-basic')).toHaveScreenshot('po-select-basic.png');
  });
});
