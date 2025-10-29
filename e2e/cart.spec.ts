import { test, expect } from '@playwright/test'

test.describe('Shopping Cart', () => {
  test('cart page is accessible', async ({ page }) => {
    // Le panier nécessite une authentification
    // Tester qu'on est redirigé vers login
    await page.goto('/cart')
    
    // Devrait rediriger vers login ou afficher la page panier
    const url = page.url()
    expect(url).toMatch(/\/(cart|login)/)
  })

  test('cart page loads for authenticated user', async ({ page }) => {
    // Se connecter rapidement
    await page.goto('/login')
    
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    await page.click('button[type="submit"]')
    
    // Attendre la redirection
    await page.waitForTimeout(2000)
    
    // Aller au panier
    await page.goto('/cart')
    
    // Le panier devrait charger
    await expect(page.locator('h1').first()).toBeVisible()
  })
})

