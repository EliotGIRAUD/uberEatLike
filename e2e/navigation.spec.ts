import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load home page', async ({ page }) => {
    const response = await page.goto('/')
    
    // La page doit répondre avec succès
    expect(response?.status()).toBeLessThan(400)
    
    // La page doit avoir du contenu
    const content = await page.content()
    expect(content.length).toBeGreaterThan(100)
  })

  test('can access restaurants page directly', async ({ page }) => {
    const response = await page.goto('/restaurants')
    
    // Vérifier que la page charge
    expect(response?.status()).toBeLessThan(400)
    
    // Vérifier l'URL
    await expect(page).toHaveURL(/\/restaurants/)
  })

  test('can access login page directly', async ({ page }) => {
    await page.goto('/login')
    
    // Vérifier l'URL
    await expect(page).toHaveURL(/\/login/)
    
    // Le formulaire doit être présent
    await expect(page.locator('form')).toBeVisible()
  })

  test('is responsive on mobile', async ({ page }) => {
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    const response = await page.goto('/')
    
    // La page doit charger même sur mobile
    expect(response?.status()).toBeLessThan(400)
  })
})

