import { test, expect } from '@playwright/test';

test.describe('po-divider - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-divider-basic');
    await page.waitForSelector('po-divider');
    await expect(page.locator('sample-po-divider-basic')).toHaveScreenshot('po-divider-basic.png');
  });
});
