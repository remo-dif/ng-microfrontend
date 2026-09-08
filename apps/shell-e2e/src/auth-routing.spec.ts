import { expect, Page, test } from '@playwright/test';

async function signIn(page: Page, email: string): Promise<void> {
  await page.getByLabel('Email').fill(email);
  await page.getByRole('button', { name: 'Continue' }).click();
}

test('redirects unauthenticated users to login and returns them to orders', async ({
  page,
}) => {
  await page.goto('/orders');

  await expect(page).toHaveURL(/\/login\?returnUrl=%2Forders/);
  await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

  await signIn(page, 'customer@example.com');

  await expect(page).toHaveURL(/\/orders$/);
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();
});

test('blocks a customer from the admin route', async ({ page }) => {
  await page.goto('/login');
  await signIn(page, 'customer@example.com');
  await page.goto('/admin');

  await expect(page).toHaveURL(/\/products$/);
  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();
});

test('allows an administrator to access the admin route', async ({ page }) => {
  await page.goto('/login');
  await signIn(page, 'developer+admin@example.com');
  await page.goto('/admin');

  await expect(
    page.getByRole('heading', { name: 'Administration' })
  ).toBeVisible();
});
