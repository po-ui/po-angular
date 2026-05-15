import { test, expect } from '@playwright/test';

test.describe('po-checkbox - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-checkbox-basic');
    await page.waitForSelector('po-checkbox');
    await expect(page.locator('sample-po-checkbox-basic')).toHaveScreenshot('po-checkbox-basic.png');
  });
});
