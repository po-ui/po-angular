import { test, expect } from '@playwright/test';

test.describe('po-button - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-button-basic');
    await page.waitForSelector('po-button');
    await expect(page.locator('sample-po-button-basic')).toHaveScreenshot('po-button-basic.png');
  });
});
