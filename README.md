# Grosmino's - Plateforme de livraison de repas

> Application web moderne de livraison de repas avec gestion multi-rôles, développée avec Nuxt 4, TypeScript et Tailwind CSS.

## Aperçu

Grosmino's est une plateforme complète de commande et livraison de repas en ligne, offrant une expérience utilisateur moderne et fluide. L'application gère trois types d'utilisateurs (Clients, Restaurateurs, Administrateurs) avec des fonctionnalités dédiées à chaque rôle.

### Points clés

- SSR (Server-Side Rendering) pour un SEO optimal
- Internationalisation FR/EN avec switch dynamique
- Authentification avec middleware sécurisés
- Gestion d'état centralisée avec Pinia
- Design moderne et responsive avec Tailwind CSS
- TypeScript strict pour une qualité de code optimale

## Fonctionnalités

### Pour les Clients
- Recherche et navigation dans les restaurants
- Consultation des menus et détails des plats
- Panier avec gestion des quantités
- Historique et suivi des commandes
- Gestion du profil utilisateur

### Pour les Restaurateurs
- Dashboard de gestion du restaurant
- Gestion complète du menu (CRUD)
- Visualisation des commandes
- Modification des informations du restaurant
- Statistiques en temps réel

### Pour les Administrateurs
- Gestion des restaurateurs
- Ajout/Modification/Suppression de restaurants
- Vue d'ensemble du système
- Contrôle d'accès complet

## Technologies

### Core
- Framework Vue.js avec SSR
- TypeScript - Typage strict
- Tailwind CSS 4 - Framework CSS utility-first

### State Management & Data
- Pinia - Store Vue.js moderne
- @pinia-plugin-persistedstate - Persistance du state

### Internationalisation
- @nuxtjs/i18n - Support multilingue (FR/EN)

### UI/UX
- Vue 3 Composition API Architecture réactive moderne
- IziToast - Notifications élégantes

## Installation

### Prérequis

- Node.js 18.x ou supérieur
- npm, pnpm, yarn ou bun

### Étapes

```bash
# Cloner le repository
git clone https://github.com/EliotGIRAUD/uberEatLike.git
cd uberEatLike

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## Utilisation

### Développement

```bash
# Serveur de développement avec hot-reload
npm run dev

# Build de production
npm run build

# Prévisualiser la build de production
npm run preview

# Générer le site statique
npm run generate
```

### Comptes de test

Pour tester l'application, vous pouvez créer des comptes ou utiliser les rôles suivants :

| Rôle | Email | Fonctionnalités |
|------|-------|-----------------|
| Client | Navigation, commandes, panier |
| Restaurateur | Gestion menu, commandes |
| Admin | Gestion complète |

## Rôles utilisateurs

### Client
Le client peut naviguer parmi les restaurants, consulter les menus, ajouter des plats au panier et passer des commandes.

**Pages accessibles :**
- `/restaurants` - Liste des restaurants
- `/restaurants/[id]` - Détail d'un restaurant
- `/foods/[id]` - Détail d'un plat
- `/cart` - Panier
- `/orders` - Mes commandes
- `/profile` - Mon profil

### Restaurateur
Le restaurateur gère son établissement, ses plats et consulte ses commandes.

**Pages accessibles :**
- `/restaurateur` - Dashboard
  - Gestion du profil du restaurant
  - CRUD des plats
  - Visualisation des commandes

### Administrateur
L'administrateur a un accès complet pour gérer tous les restaurateurs de la plateforme.

**Pages accessibles :**
- `/admin` - Back office
  - Gestion des restaurateurs (CRUD)
  - Statistiques globales

## Structure du projet

### Stores Pinia

| Store | Responsabilité |
|-------|----------------|
| `user.ts` | Authentification et gestion des utilisateurs |
| `cart.ts` | Panier d'achat avec getters (totalItems, totalPrice) |
| `order.ts` | Gestion des commandes |
| `food.ts` | CRUD des plats |
| `restaurateur.ts` | CRUD des restaurants |

### Middleware

| Middleware | Fonction |
|------------|----------|
| `auth.ts` | Vérifie l'authentification |
| `guest.ts` | Redirige les utilisateurs connectés |
| `client.ts` | Réservé aux clients |
| `admin.ts` | Réservé aux administrateurs |
| `restaurateur.ts` | Réservé aux restaurateurs |

## Fonctionnalités avancées

### Server-Side Rendering (SSR)

Toutes les pages publiques sont rendues côté serveur pour :
- Meilleur référencement SEO
- Temps de chargement initial réduit
- Performance optimale

### Internationalisation (i18n)

Support multilingue avec changement dynamique :

**Langues supportées :**    
- 🇫🇷 Français (par défaut)
- 🇬🇧 English

## Roadmap

### Version actuelle (v1.0)
- Authentification multi-rôles
- Gestion des restaurants et menus
- Système de commandes
- Internationalisation FR/EN
- SSR et SEO optimisés

### Prochaines étapes (v1.1)
- Tests unitaires (Vitest)
- Tests E2E (Playwright)
- PWA avec mode offline
- Optimisation des images (WebP/AVIF)
- CI/CD avec GitHub Actions

### Futures fonctionnalités (v2.0)
- Paiement en ligne
- Suivi en temps réel des livraisons
- Système de notation et avis
- Notifications push
- API REST/GraphQL

## Auteur

**Eliot** - Front-End Master 1


