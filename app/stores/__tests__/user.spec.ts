import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '../user'
import { useRestaurateurStore } from '../restaurateur'

describe('useUserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('registerOrLogin', () => {
    it('devrait enregistrer un nouvel utilisateur', () => {
      const store = useUserStore()

      const newUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CLIENT' as const
      }

      store.registerOrLogin(newUser)

      expect(store.users).toHaveLength(1)
      expect(store.currentUser).toMatchObject(newUser)
      expect(store.isLoggedIn).toBe(true)
    })

    it('devrait mettre à jour un utilisateur existant', () => {
      const store = useUserStore()

      const user = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CLIENT' as const
      }

      store.registerOrLogin(user)

      const updatedUser = {
        name: 'John Updated',
        email: 'john@example.com',
        password: 'newpassword',
        role: 'ADMIN' as const
      }

      store.registerOrLogin(updatedUser)

      expect(store.users).toHaveLength(1)
      expect(store.currentUser?.name).toBe('John Updated')
      expect(store.currentUser?.role).toBe('ADMIN')
    })

    it('devrait être insensible à la casse pour l\'email', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'John',
        email: 'john@example.com',
        password: 'pass',
        role: 'CLIENT'
      })

      store.registerOrLogin({
        name: 'John Updated',
        email: 'JOHN@EXAMPLE.COM',
        password: 'newpass',
        role: 'CLIENT'
      })

      expect(store.users).toHaveLength(1)
      expect(store.currentUser?.name).toBe('John Updated')
    })

    it('devrait connecter l\'utilisateur après inscription', () => {
      const store = useUserStore()

      const user = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password456',
        role: 'RESTAURATEUR' as const
      }

      store.registerOrLogin(user)

      expect(store.isLoggedIn).toBe(true)
      expect(store.currentUser).not.toBeNull()
      expect(store.currentUser?.email).toBe('jane@example.com')
    })
  })

  describe('login', () => {
    it('devrait connecter un utilisateur existant avec les bonnes credentials', () => {
      const store = useUserStore()

      const user = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT' as const
      }

      store.registerOrLogin(user)
      store.logout()

      const loginSuccess = store.login({
        email: 'test@example.com',
        password: 'password123'
      })

      expect(loginSuccess).toBe(true)
      expect(store.isLoggedIn).toBe(true)
      expect(store.currentUser?.email).toBe('test@example.com')
    })

    it('devrait échouer avec un mauvais mot de passe', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      store.logout()

      const loginSuccess = store.login({
        email: 'test@example.com',
        password: 'wrongpassword'
      })

      expect(loginSuccess).toBe(false)
      expect(store.isLoggedIn).toBe(false)
      expect(store.currentUser).toBeNull()
    })

    it('devrait échouer avec un email inexistant', () => {
      const store = useUserStore()

      const loginSuccess = store.login({
        email: 'nonexistent@example.com',
        password: 'password123'
      })

      expect(loginSuccess).toBe(false)
      expect(store.isLoggedIn).toBe(false)
      expect(store.currentUser).toBeNull()
    })

    it('devrait être insensible à la casse pour l\'email', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      store.logout()

      const loginSuccess = store.login({
        email: 'TEST@EXAMPLE.COM',
        password: 'password123'
      })

      expect(loginSuccess).toBe(true)
      expect(store.isLoggedIn).toBe(true)
    })

    it('devrait connecter un restaurateur depuis le store restaurateur', () => {
      const userStore = useUserStore()
      const restaurateurStore = useRestaurateurStore()

      restaurateurStore.addRestaurateur({
        nom: 'Restaurant Test',
        adresse: '123 Rue Test',
        codePostal: '75001',
        ville: 'Paris',
        email: 'resto@example.com',
        password: 'restopass'
      })

      const loginSuccess = userStore.login({
        email: 'resto@example.com',
        password: 'restopass'
      })

      expect(loginSuccess).toBe(true)
      expect(userStore.isLoggedIn).toBe(true)
      expect(userStore.currentUser?.role).toBe('RESTAURATEUR')
      expect(userStore.currentUser?.restaurateurId).toBeDefined()
    })
  })

  describe('logout', () => {
    it('devrait déconnecter l\'utilisateur', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      expect(store.isLoggedIn).toBe(true)

      store.logout()

      expect(store.isLoggedIn).toBe(false)
      expect(store.currentUser).toBeNull()
    })

    it('devrait pouvoir se déconnecter plusieurs fois sans erreur', () => {
      const store = useUserStore()

      store.logout()
      expect(() => store.logout()).not.toThrow()
      expect(store.isLoggedIn).toBe(false)
    })
  })

  describe('updateProfile', () => {
    it('devrait mettre à jour le profil de l\'utilisateur connecté', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Old Name',
        email: 'old@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      const success = store.updateProfile({
        name: 'New Name',
        email: 'new@example.com'
      })

      expect(success).toBe(true)
      expect(store.currentUser?.name).toBe('New Name')
      expect(store.currentUser?.email).toBe('new@example.com')
    })

    it('devrait mettre à jour le mot de passe', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'oldpassword',
        role: 'CLIENT'
      })

      const success = store.updateProfile({
        password: 'newpassword'
      })

      expect(success).toBe(true)
      expect(store.currentUser?.password).toBe('newpassword')
    })

    it('devrait mettre à jour le rôle', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        role: 'CLIENT'
      })

      const success = store.updateProfile({
        role: 'ADMIN'
      })

      expect(success).toBe(true)
      expect(store.currentUser?.role).toBe('ADMIN')
    })

    it('devrait refuser un email déjà utilisé par un autre utilisateur', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'pass1',
        role: 'CLIENT'
      })

      store.logout()

      store.registerOrLogin({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'pass2',
        role: 'CLIENT'
      })

      const success = store.updateProfile({
        email: 'user1@example.com'
      })

      expect(success).toBe(false)
      expect(store.currentUser?.email).toBe('user2@example.com')
    })

    it('devrait retourner false si aucun utilisateur n\'est connecté', () => {
      const store = useUserStore()

      const success = store.updateProfile({
        name: 'New Name'
      })

      expect(success).toBe(false)
    })

    it('devrait mettre à jour l\'utilisateur dans la liste users', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      store.updateProfile({
        name: 'Updated Name'
      })

      const userInList = store.users.find(u => u.email === 'test@example.com')
      
      expect(userInList).toBeDefined()
      expect(userInList?.name).toBe('Updated Name')
    })

    it('devrait permettre de garder le même email', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      const success = store.updateProfile({
        name: 'New Name',
        email: 'test@example.com'
      })

      expect(success).toBe(true)
      expect(store.currentUser?.name).toBe('New Name')
      expect(store.currentUser?.email).toBe('test@example.com')
    })
  })

  describe('state persistence', () => {
    it('devrait maintenir plusieurs utilisateurs dans la liste', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'User 1',
        email: 'user1@example.com',
        password: 'pass1',
        role: 'CLIENT'
      })

      store.logout()

      store.registerOrLogin({
        name: 'User 2',
        email: 'user2@example.com',
        password: 'pass2',
        role: 'ADMIN'
      })

      expect(store.users).toHaveLength(2)
    })

    it('devrait préserver les données utilisateur après déconnexion', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'CLIENT'
      })

      store.logout()

      expect(store.users).toHaveLength(1)
      expect(store.users[0]?.email).toBe('test@example.com')
    })
  })

  describe('edge cases', () => {
    it('devrait gérer les emails vides gracieusement', () => {
      const store = useUserStore()

      const loginSuccess = store.login({
        email: '',
        password: 'password'
      })

      expect(loginSuccess).toBe(false)
    })

    it('devrait gérer les mots de passe vides gracieusement', () => {
      const store = useUserStore()

      store.registerOrLogin({
        name: 'Test',
        email: 'test@example.com',
        password: '',
        role: 'CLIENT'
      })

      store.logout()

      const loginSuccess = store.login({
        email: 'test@example.com',
        password: ''
      })

      expect(loginSuccess).toBe(true)
    })
  })
})

