const { test, expect } = require('@playwright/test');

// R05: No permite confirmar sin nombre de entrega
// NOTA: Esta prueba está diseñada para FALLAR debido a un defecto intencional en QuickBite.
test('R05 - No permite confirmar sin nombre de entrega', async ({ page }) => {
  await page.goto('/');

  // 1. Agregar al menos un producto al carrito
  const addButton = page.locator('button[data-product]').first();
  await addButton.click();

  // 2. Asegurarse de que el campo de nombre de entrega quede vacío
  // (Busca el input de cliente por id, name o placeholder común)
  const nameInput = page.locator('#customer-name, #name, input[name="name"], input[placeholder*="nombre" i]').first();
  if (await nameInput.count() > 0) {
    await nameInput.fill('');
  }

  // 3. Intentar confirmar el pedido
  await page.locator('#checkout').click();

  // 4. Verificación de regla de negocio: Debe rechazar el pedido o mostrar advertencia de nombre obligatorio
  const messageArea = page.locator('#message');
  await expect(messageArea).toContainText(/nombre|requerido|obligatorio|ingrese/i);
  await expect(messageArea).not.toContainText(/éxito|confirmado|recibido|gracias/i);
});

// R06: Búsqueda sin coincidencias
test('R06 - Búsqueda sin coincidencias', async ({ page }) => {
  await page.goto('/');

  // 1. Buscar una cadena que garantice 0 resultados
  await page.locator('#search').fill('TextoInexistenteXYZ123');

  // 2. Comprobar que en el área de productos no hay botones para agregar ni tarjetas
  const productButtons = page.locator('#products button[data-product]');
  await expect(productButtons).toHaveCount(0);
});