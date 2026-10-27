const { test, expect } = require('@playwright/test');

// R01: Rechaza credenciales incorrectas
test('R01 - Rechaza credenciales incorrectas', async ({ page }) => {
  await page.goto('/');

  // Ingresar credenciales inválidas
  await page.locator('#user').fill('usuario_invalido');
  await page.locator('#password').fill('clave_erronea');
  await page.locator('#login').click();

  // Verificar mensaje de rechazo en login-result
  const loginResult = page.locator('#login-result');
  await expect(loginResult).toBeVisible();
  await expect(loginResult).not.toBeEmpty();
  await expect(loginResult).toContainText(/incorrect|inválid|error|fall/i);
});

// R02: Filtra productos por búsqueda
test('R02 - Filtra productos por búsqueda', async ({ page }) => {
  await page.goto('/');

  // Filtrar por "Pizza"
  await page.locator('#search').fill('Pizza');

  // Verificar que Pizza esté visible en el catálogo
  const productsArea = page.locator('#products');
  await expect(productsArea.getByText('Pizza', { exact: false })).toBeVisible();

  // Verificar que Tacos NO aparezca en el catálogo filtrado
  await expect(productsArea.getByText('Tacos', { exact: false })).not.toBeVisible();
});

// R03: Actualiza contador del carrito
test('R03 - Actualiza contador del carrito', async ({ page }) => {
  await page.goto('/');

  // Seleccionar y agregar dos productos distintos usando el atributo data-product
  const addButtons = page.locator('button[data-product]');
  await addButtons.nth(0).click();
  await addButtons.nth(1).click();

  // Verificar que el contador del carrito muestre exactamente 2
  const cartCount = page.locator('#cart-count');
  await expect(cartCount).toHaveText('2');
});

// R04: Impide pedido sin productos
test('R04 - Impide pedido sin productos', async ({ page }) => {
  await page.goto('/');

  // Sin agregar productos, intentar confirmar pedido
  await page.locator('#checkout').click();

  // Verificar advertencia de carrito vacío
  const messageArea = page.locator('#message');
  await expect(messageArea).toBeVisible();
  await expect(messageArea).toContainText(/vacío|agrega|productos/i);
});