import { test, expect } from '@playwright/test';

test.describe('po-button-group - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-button-group-basic');
    await page.waitForSelector('po-button-group');
    await expect(page.locator('po-button-group')).toHaveScreenshot('po-button-group-basic.png');
  });
});
