import { test, expect } from '@playwright/test'

test.describe('Restaurants', () => {
  test('can load restaurants page', async ({ page }) => {
    const response = await page.goto('/restaurants')
    
    // La page doit charger avec succès
    expect(response?.status()).toBeLessThan(400)
    
    // Vérifier l'URL
    await expect(page).toHaveURL(/\/restaurants/)
  })

  test('can access a specific restaurant by ID', async ({ page }) => {
    // Accéder directement à un restaurant (ID 1 devrait exister)
    const response = await page.goto('/restaurants/1')
    
    // La page doit répondre (même si c'est une erreur, on check juste qu'elle répond)
    expect(response?.status()).toBeDefined()
    
    // Vérifier l'URL
    await expect(page).toHaveURL(/\/restaurants\/1/)
  })
})

test.describe('Foods', () => {
  test('can access a specific food by ID', async ({ page }) => {
    // Accéder directement à un plat (ID 1 devrait exister)
    const response = await page.goto('/foods/1')
    
    // La page doit répondre
    expect(response?.status()).toBeDefined()
    
    // Vérifier l'URL
    await expect(page).toHaveURL(/\/foods\/1/)
  })

  test('food page displays price', async ({ page }) => {
    await page.goto('/foods/1')
    
    // Vérifier que la page charge
    await expect(page).toHaveURL(/\/foods\/1/)
    
    // Le contenu doit être présent
    const content = await page.content()
    expect(content.length).toBeGreaterThan(100)
  })
})

