# UberEatLike Front (Nuxt 4)

Front-end Nuxt du projet Uber Eats (M1), connecté à l’API Fastify/Prisma.

## Stack

- Nuxt 4 + Vue 3 + TypeScript
- Pinia (+ persisted state)
- Tailwind CSS
- i18n (FR/EN)
- Vitest + Playwright

## Prérequis

- Node.js 18+ (20+ recommandé)
- npm
- API `uberEats-api` démarrée

## Installation

```bash
npm install
```

## Variables d'environnement

Créer un `.env` dans `uberEatLike` :

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
```

## Lancer le front

```bash
# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview
```

Application disponible sur `http://localhost:3000`.

## Scripts utiles

- `npm run dev`
- `npm run build`
- `npm test`
- `npm run test:watch`
- `npm run test:e2e`
- `npm run analyze`

## Comptes de test

Ces comptes viennent du seed API (`uberEats-api`):

- Admin: `admin@seed.local` / `admin12345`
- Restaurateur: `restaurant@seed.local` / `resto12345`
- Client: `client@seed.local` / `client12345`

## Parcours rapides de vérification

1. Client:
   - `/restaurants` -> liste
   - `/restaurants/:id` -> détail + plats
   - panier + création commande
   - `/orders` -> commandes client
2. Restaurateur:
   - `/restaurateur` -> infos resto, plats, commandes
3. Admin:
   - `/admin` -> listing restaurants + création

## Notes d’intégration API

- Les endpoints paginés REST sont consommés via l’enveloppe:

```json
{
  "data": [],
  "pagination": { "total": 0, "limit": 20, "offset": 0 }
}
```

- Routes utilisées côté front:
  - `/restaurants`
  - `/restaurants/:id`
  - `/restaurants/:id/dishes`
  - `/users/me/orders`
  - `/restaurants/me/orders`

## Dépannage

- Si aucun restaurant ne s’affiche:
  - vérifier `NUXT_PUBLIC_API_BASE`
  - vérifier que l’API tourne sur `:3001`
  - exécuter côté API: `npx prisma migrate deploy && npm run db:seed`

- Si login échoue:
  - vérifier qu’il n’y a pas d’espace en fin de mot de passe
  - vider le stockage local/session et se reconnecter


