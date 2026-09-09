import { test, expect } from '@playwright/test';

/**
 * Лаборатори №1: UI автомат тест — Playwright
 * F.CSA313 — Программ хангамжийн чанарын баталгаа ба тест
 */

test.describe('SauceDemo нэвтрэх болон үндсэн үйлдлүүдийн тест', () => {

  // Тест бүрийн өмнө нүүр хуудас руу очих
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
  });

  test('амжилттай нэвтрэх', async ({ page }) => {
    // Орчин үеийн locator-уудыг (getByPlaceholder, getByRole) ашиглах
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Амжилттай нэвтэрснийг шалгах (Products текст харагдах ёстой)
    await expect(page.getByText('Products')).toBeVisible();
    await expect(page).toHaveURL(/.*inventory.html/);

    // Гарах үйлдэл (Logout) - Тестийг зөв төгсгөх
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.getByRole('link', { name: 'Logout' }).click();
  });

  test('амжилтгүй нэвтрэх - буруу нууц үг', async ({ page }) => {
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('wrong_password');
    await page.getByRole('button', { name: 'Login' }).click();

    // Алдааны мессеж гарч буйг шалгах
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Epic sadface: Username and password do not match any user in this service');
  });

  test('бараа сагсанд нэмэх', async ({ page }) => {
    // Нэвтрэх
    await page.getByPlaceholder('Username').fill('standard_user');
    await page.getByPlaceholder('Password').fill('secret_sauce');
    await page.getByRole('button', { name: 'Login' }).click();

    // Эхний барааг сагсанд нэмэх
    // getByRole('button') ашиглан нэмэх товчийг олох
    await page.getByRole('button', { name: 'Add to cart' }).first().click();

    // Сагсны тэмдэг дээр "1" гэсэн тоо гарч буйг шалгах
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');

    // Сагснаас хасах (Цэвэрлэгээ)
    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(cartBadge).not.toBeVisible();
  });
});
