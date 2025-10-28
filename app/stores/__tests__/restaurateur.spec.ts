import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRestaurateurStore } from '../restaurateur'

describe('useRestaurateurStore - addRestaurateur', () => {
  beforeEach(() => {
    // Créer une nouvelle instance de Pinia avant chaque test
    setActivePinia(createPinia())
  })

  it('devrait ajouter un nouveau restaurateur avec succès', () => {
    const store = useRestaurateurStore()

    const newRestaurateur = {
      nom: 'Restaurant Test',
      adresse: '123 Rue de Test',
      codePostal: '75001',
      ville: 'Paris',
      email: 'test@restaurant.com',
      password: 'password123'
    }

    const result = store.addRestaurateur(newRestaurateur)

    expect(result.success).toBe(true)
    expect(result.message).toBe('Restaurateur ajouté avec succès')
    expect(store.restaurateurs).toHaveLength(1)
    
    const addedRestaurateur = store.restaurateurs[0]
    expect(addedRestaurateur).toBeDefined()
    expect(addedRestaurateur).toMatchObject(newRestaurateur)
    expect(addedRestaurateur?.id).toBeDefined()
  })

  it('devrait refuser un restaurateur avec un email déjà existant', () => {
    const store = useRestaurateurStore()

    const restaurateur1 = {
      nom: 'Restaurant 1',
      adresse: '123 Rue de Test',
      codePostal: '75001',
      ville: 'Paris',
      email: 'test@restaurant.com',
      password: 'password123'
    }

    const restaurateur2 = {
      nom: 'Restaurant 2',
      adresse: '456 Avenue Test',
      codePostal: '75002',
      ville: 'Paris',
      email: 'test@restaurant.com',
      password: 'password456'
    }

    // ajoute le premier restaurateur
    store.addRestaurateur(restaurateur1)
    
    // ajoute le second avec le meme email
    const result = store.addRestaurateur(restaurateur2)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Cet email est déjà utilisé')
    expect(store.restaurateurs).toHaveLength(1)
  })

  it('devrait vérifier les emails en mode insensible à la casse', () => {
    const store = useRestaurateurStore()

    const restaurateur1 = {
      nom: 'Restaurant 1',
      adresse: '123 Rue de Test',
      codePostal: '75001',
      ville: 'Paris',
      email: 'test@restaurant.com',
      password: 'password123'
    }

    const restaurateur2 = {
      nom: 'Restaurant 2',
      adresse: '456 Avenue Test',
      codePostal: '75002',
      ville: 'Paris',
      email: 'TEST@RESTAURANT.COM',
      password: 'password456'
    }

    store.addRestaurateur(restaurateur1)
    const result = store.addRestaurateur(restaurateur2)

    expect(result.success).toBe(false)
    expect(result.message).toBe('Cet email est déjà utilisé')
    expect(store.restaurateurs).toHaveLength(1)
  })

  it('devrait générer un id unique pour chaque restaurateur', () => {
    const store = useRestaurateurStore()

    const restaurateur1 = {
      nom: 'Restaurant 1',
      adresse: '123 Rue de Test',
      codePostal: '75001',
      ville: 'Paris',
      email: 'test1@restaurant.com',
      password: 'password123'
    }

    const restaurateur2 = {
      nom: 'Restaurant 2',
      adresse: '456 Avenue Test',
      codePostal: '75002',
      ville: 'Paris',
      email: 'test2@restaurant.com',
      password: 'password456'
    }

    store.addRestaurateur(restaurateur1)
    store.addRestaurateur(restaurateur2)

    expect(store.restaurateurs).toHaveLength(2)
    
    const firstRestaurateur = store.restaurateurs[0]
    const secondRestaurateur = store.restaurateurs[1]
    expect(firstRestaurateur).toBeDefined()
    expect(secondRestaurateur).toBeDefined()
    expect(firstRestaurateur?.id).not.toBe(secondRestaurateur?.id)
  })

  it('devrait retourner un objet avec les propriétés success et message', () => {
    const store = useRestaurateurStore()

    const newRestaurateur = {
      nom: 'Restaurant Test',
      adresse: '123 Rue de Test',
      codePostal: '75001',
      ville: 'Paris',
      email: 'test@restaurant.com',
      password: 'password123'
    }

    const result = store.addRestaurateur(newRestaurateur)

    expect(result).toHaveProperty('success')
    expect(result).toHaveProperty('message')
    expect(typeof result.success).toBe('boolean')
    expect(typeof result.message).toBe('string')
  })
})

