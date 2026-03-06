import { test, expect } from '@playwright/test';

test('capture light aesthetic dashboard', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000); // Wait for animations
  await page.screenshot({ path: '/home/jules/verification/light_aesthetic.png', fullPage: true });
});
