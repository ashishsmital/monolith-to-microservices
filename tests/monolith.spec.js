import { test, expect } from '@playwright/test';

test.describe('Monolith Application', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fancy Store/);
    await expect(page.locator('text=Home')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Products');
    await expect(page).toHaveURL(/\/products/);
    await expect(page.locator('h5:has-text("Products")')).toBeVisible();
  });

  test('should display product list', async ({ page }) => {
    await page.goto('/products');
    await page.waitForSelector('[class*="MuiCard"]');
    const products = await page.locator('[class*="MuiCard"]').count();
    expect(products).toBeGreaterThan(0);
  });

  test('should navigate to orders page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Orders');
    await expect(page).toHaveURL(/\/orders/);
    await expect(page.locator('h5:has-text("Orders")')).toBeVisible();
  });

  test('should display order list', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForSelector('table');
    const orderRows = await page.locator('table tbody tr').count();
    expect(orderRows).toBeGreaterThan(0);
  });

  test('should navigate to order details', async ({ page }) => {
    await page.goto('/orders');
    await page.waitForSelector('table tbody tr');
    
    const firstOrderId = await page.locator('table tbody tr:first-child td:first-child').textContent();
    await page.locator('table tbody tr:first-child').click();
    
    await expect(page).toHaveURL(new RegExp(`/orders/${firstOrderId}`));
    await expect(page.locator(`text=Order ${firstOrderId}`)).toBeVisible();
  });

  test('should handle navigation between pages', async ({ page }) => {
    await page.goto('/');
    
    await page.click('text=Products');
    await expect(page).toHaveURL(/\/products/);
    
    await page.click('text=Orders');
    await expect(page).toHaveURL(/\/orders/);
    
    await page.click('text=Home');
    await expect(page).toHaveURL(/\/$/);
  });
});