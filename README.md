# Fate War Market — mise en place

Version minimale : une base de données réelle + une page `/admin/new` protégée par mot de passe
pour créer des annonces à la main + une page `/browse` qui les affiche. Le design complet du
mockup (Homepage + grille stylée) sera rebranché sur ces mêmes données ensuite.

## 1. Créer la base de données (Neon, gratuit)

1. Va sur https://neon.tech, crée un compte, crée un projet.
2. Dans le dashboard du projet, copie la "Connection string" (elle commence par `postgresql://...`).
3. Neon te donne en général deux URLs (pooled / direct) — copie les deux, on en a besoin.

## 2. Configurer le projet en local

```bash
cd fatewar-market
npm install
cp .env.example .env
```

Ouvre `.env` et remplace :
- `DATABASE_URL` par l'URL "pooled" de Neon
- `DATABASE_URL_UNPOOLED` par l'URL "direct" de Neon (si Neon n'en donne qu'une, mets la même dans les deux)
- `ADMIN_SECRET` par un mot de passe que toi seul connais

Puis crée les tables dans la base :

```bash
npm run db:push
```

## 3. Tester en local

```bash
npm run dev
```

Ouvre http://localhost:3000/admin/login, connecte-toi avec ton `ADMIN_SECRET`, tu arrives sur le
formulaire de création d'annonce. Une fois publiée, elle apparaît sur http://localhost:3000/browse.

Tu peux aussi ouvrir la base visuellement avec `npm run db:studio` (ajouter/modifier une annonce
directement dans un tableau, sans passer par le formulaire).

## 4. Déployer (Vercel, gratuit)

1. Mets le code sur GitHub (crée un repo, `git init`, `git add .`, `git commit`, `git push`).
2. Va sur https://vercel.com, "Import Project", sélectionne ce repo.
3. Dans les "Environment Variables" du projet Vercel, ajoute les 3 mêmes variables que dans `.env`
   (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `ADMIN_SECRET`).
4. Déploie. Vercel te donne une URL du type `fatewar-market.vercel.app`.

Ton site est en ligne. Pour ajouter une annonce : va sur `tonsite.vercel.app/admin/login`.

## 5. Connecter Discord (pour la page Middleman et les pages compte)

1. Dans Discord, ouvre ton serveur → clique droit sur le nom du serveur → **Inviter des gens**.
2. Copie le lien (`https://discord.gg/...`), avec une expiration "Ne jamais expirer" si possible.
3. Mets-le dans `DISCORD_INVITE_URL` (`.env` local ET variables d'environnement Vercel), puis redéploie.

La page "Vendre son compte" n'a besoin d'aucune configuration : elle indique simplement d'ajouter **0panda_roux0** en ami sur Discord.

## 6. Après une mise à jour du schéma de base de données

Si un jour le fichier `prisma/schema.prisma` change (nouveaux champs), il faut resynchroniser la base :

```bash
npx prisma generate
npm run db:push
```


- Le design complet du mockup n'est pas encore branché sur `/browse` — c'est du HTML brut pour
  l'instant, pour vérifier que la base fonctionne d'abord.
- Pas d'upload d'images : on colle des URLs (ex: hébergées sur https://imgur.com ou un bucket
  S3/Cloudflare R2) dans le formulaire. On ajoutera un vrai uploader ensuite.
- La protection admin est un mot de passe simple, pas un vrai compte utilisateur — largement
  suffisant pour un usage perso, à durcir avant d'ouvrir la vente aux tiers.
- Pas encore de page de détail, d'offres, de comptes vendeurs : c'est la suite logique une fois
  que tu peux déjà créer et voir des annonces.
