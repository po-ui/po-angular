import { test, expect } from '@playwright/test';

test.describe('po-table - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-table-basic');
    await page.waitForSelector('po-table');
    await expect(page.locator('sample-po-table-basic')).toHaveScreenshot('po-table-basic.png');
  });
});
