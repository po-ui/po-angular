import { test, expect } from '@playwright/test';

test.describe('po-progress - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-progress-basic');
    await page.waitForSelector('po-progress');
    await expect(page.locator('sample-po-progress-basic')).toHaveScreenshot('po-progress-basic.png');
  });
});
