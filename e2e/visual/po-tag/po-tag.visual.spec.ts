import { test, expect } from '@playwright/test';

test.describe('po-tag - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-tag-basic');
    await page.waitForSelector('po-tag');
    await expect(page.locator('sample-po-tag-basic')).toHaveScreenshot('po-tag-basic.png');
  });
});
