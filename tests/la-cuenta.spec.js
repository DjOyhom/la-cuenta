import { test, expect } from '@playwright/test';

test('flujo completo restaurante-cliente', async ({ context, baseURL }) => {
  const restaurant = await context.newPage();
  const customer = await context.newPage();

  await restaurant.goto(`${baseURL}/?role=restaurant`);
  await restaurant.getByRole('button', { name: /Reiniciar demo/i }).click();

  await customer.goto(`${baseURL}/?role=customer`);
  await expect(customer.getByRole('heading', { name: 'Mesa 8' })).toBeVisible();
  await expect(customer.getByText('Hamburguesa vegana').first()).toBeVisible();

  await restaurant.getByRole('button', { name: /Café/i }).click();
  await expect(customer.getByText('Café').first()).toBeVisible();

  await customer.getByRole('button', { name: 'Seleccionar todo' }).click();
  await customer.getByRole('button', { name: '15%' }).click();
  await customer.getByRole('button', { name: /Mercado Pago/i }).click();

  customer.once('dialog', dialog => dialog.accept());
  await customer.getByRole('button', { name: 'Pagar ahora' }).click();

  await expect(customer.getByText(/Saldo restante de la mesa:/)).toContainText('$ 0');
  await expect(restaurant.getByText('Pagada')).toBeVisible();
  await expect(restaurant.getByText('Mercado Pago').first()).toBeVisible();
  await expect(restaurant.getByText(/Todavía no se registraron pagos/)).toHaveCount(0);
});

test('@smoke la versión publicada carga ambas vistas', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/?role=customer`);
  await expect(page.getByText('LaCuenta')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mesa 8' })).toBeVisible();

  await page.goto(`${baseURL}/?role=restaurant`);
  await expect(page.getByText('Panel del restaurante')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mesa 8' })).toBeVisible();
});
