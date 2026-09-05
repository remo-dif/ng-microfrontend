import { test, expect } from '@playwright/test';

test('loads the federated product catalogue', async ({ page }) => {
  await page.goto('/products');
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
  await expect(page.getByText('Enterprise keyboard')).toBeVisible();
});
