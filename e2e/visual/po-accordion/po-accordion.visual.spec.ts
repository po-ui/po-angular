import { test, expect } from '@playwright/test';

test.describe('po-accordion - visual regression', () => {
  test('basic', async ({ page }) => {
    await page.goto('/visual/po-accordion-basic');
    await page.waitForSelector('po-accordion');
    await expect(page.locator('sample-po-accordion-basic')).toHaveScreenshot('po-accordion-basic.png');
  });
});
