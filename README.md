# SHOP PRO

Site vitrine et catalogue pour **SHOP PRO**, entreprise sénégalaise de vente
de **vêtements et tenues professionnelles et scolaires personnalisées**
(packs d'habillement en blouson, Lacoste personnalisés, tenues de travaux
pratiques (TP), modèles d'habillement professionnel pour écoles, lycées,
centres et établissements de formation professionnelle). Responsable :
**M. NDAO** (77 366 97 21 / 76 844 16 77).

Frontend React connecté au backend multi-tenant **ABMCY Core** — même
architecture que les projets frères `HANNIFA` (HANI'S, maison de couture) et
`Paradis-Services` (location de chambres/prestations), adaptée pour un usage
"vêtement professionnel/technique" plutôt que mode ou hôtellerie.

## Stack technique

- **React 18** + **Vite 6** + **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme` tokens, pas de config JS séparée)
- **React Router v6** (`HashRouter` — pas besoin de règles de réécriture
  côté serveur sur un hébergement statique type Vercel/Netlify)
- Aucun state manager externe : un contexte React (`StoreContext`) gère la
  commande en cours en `localStorage`.
- Aucune dépendance backend embarquée : tout passe par `src/services/abmcy.ts`,
  qui appelle l'API ABMCY Core (Go, multi-tenant, RLS Postgres) — voir le
  projet backend `abmcycors` (non modifié ici).

## Configuration

1. Copier `.env.example` vers `.env` :
   ```bash
   cp .env.example .env
   ```
2. Renseigner les variables :
   - `VITE_ABMCY_API_URL` — URL de l'API ABMCY (par défaut `https://api.abmcy.com`)
   - `VITE_ABMCY_API_KEY` — clé API du tenant "SHOP PRO" (`pk_live_...`),
     fournie depuis le dashboard admin ABMCY à la création du tenant.
     **Vide par défaut** — tant qu'aucun tenant réel n'a été créé côté
     backend, les appels API échouent proprement et le site retombe sur les
     produits de référence du cahier des charges (voir plus bas), pas sur un
     écran d'erreur.
   - `VITE_ABMCY_TENANT_SLUG` — `shop-pro` par défaut.
3. Ne jamais committer `.env` (déjà exclu par `.gitignore`).

**Côté backend (pas fait ici, à faire avant mise en ligne réelle)** : un
opérateur ABMCY doit créer le tenant "SHOP PRO" depuis le dashboard admin —
`business_type` conseillé : `commerce_general` (vêtements prêt-à-porter et
sur-mesure standardisé, pas de couture haute couture avec mesures corporelles
ni de tissus comme HANI'S). Ce préréglage active produits + panier + avis ;
`gallery_enabled` doit en plus être activé manuellement pour la page Galerie.

## Démarrage

```bash
npm install
npm run dev        # serveur de dev sur http://localhost:3000
npm run build       # build de production dans dist/
npm run typecheck   # vérification TypeScript sans émission
npm run preview     # sert le build de production localement
```

`npm install`, `npm run typecheck` et `npm run build` ont été vérifiés et
passent sans erreur dans cette conversation.

## Modèle de données côté backend

Le backend ABMCY Core est un **modulith générique** : `products.category`
vaut `"tp"`, `"blouson"`, `"lacoste"`, `"etablissement"` ou `"autre"`, et tout
le reste (tailles, couleurs disponibles) vit librement dans
`products.attributes` (JSONB, aucune colonne dédiée). Voir
`src/lib/mapProduct.ts` pour la convention exacte utilisée par ce frontend
(`sizes[]`, `colors[]`). La personnalisation demandée par chaque client (logo,
texte, nom, numéro, filière, établissement) n'a pas de colonnes dédiées non
plus : elle est envoyée dans le champ `notes` de la commande (`POST /orders`)
au moment de la commande ou du devis — voir `src/pages/Commander.tsx` et
`src/pages/CommandeGroupee.tsx`.

Aucune modification du backend Go n'a été nécessaire pour ce nouveau tenant
— c'est tout l'intérêt du modèle catalogue générique.

### Piège connu : photos de produit

Il n'y a **pas** de champ `image_url` à envoyer dans `POST /products`. Un
produit est créé sans photo, puis chaque photo est attachée séparément via
`POST /uploads/image?product_id={id}` (multipart, champ `image`). `GET
/products` renvoie un tableau `images: [{id, url}]` par produit —
`src/lib/mapProduct.ts` lit `p.images?.[0]?.url` en priorité (jamais un champ
`image_url` à plat, qui n'existe pas dans la réponse de l'API), avec un repli
sur `attributes.image_url` puis sur une image de secours locale.

## Pages

| Route | Rôle |
|---|---|
| `/` | Accueil : accroche personnalisation, produits phares, CTA commandes d'écoles, témoignages |
| `/catalogue` | Liste filtrable (TP, pack blouson, Lacoste, établissements, autres modèles) |
| `/produits/:id` | Fiche produit — photos, tailles, couleurs, zone de personnalisation (logo, texte, établissement), commander ou devis, WhatsApp direct, partage social |
| `/commander` | Finalisation de la commande/devis (panier -> `POST /orders`), choix commande directe vs devis |
| `/commande-groupee` | Formulaire dédié écoles/établissements : répartition des tailles, logo, date de livraison — toujours un devis |
| `/comment-commander` | Étapes du processus de commande, de la sélection au paiement manuel |
| `/a-propos` | Présentation de SHOP PRO |
| `/contact` | Téléphone, WhatsApp, e-mail, zone d'intervention |
| `/galerie` | Galerie de réalisations, avec partage social |

## Produits de référence (données d'exemple frontend)

En attendant la création du vrai tenant côté backend, `src/data/catalog.ts`
expose `FALLBACK_PRODUCTS` : les 5 produits du cahier des charges (tenue de
TP à 16 000 FCFA, pack blouson 5 pièces à 25 000 FCFA, Lacoste personnalisé
sur devis, tenues professionnelles sur mesure pour établissements sur devis,
autres modèles sur devis). Ces produits ne sont **jamais envoyés à l'API** —
ils ne servent qu'à afficher un catalogue crédible tant qu'aucune vraie
annonce n'existe. Dès que `GET /products` renvoie au moins un produit réel,
le frontend bascule automatiquement sur les vraies données (voir `Home.tsx`
et `Catalogue.tsx`, drapeau `usingFallback`).

**Les vraies annonces SHOP PRO devront être créées depuis le dashboard
tenant une fois le vrai tenant provisionné côté backend** — ce frontend ne
propose pas de formulaire de publication public (SHOP PRO n'est pas une
marketplace).

## Fonctionnalité clé : filigrane sur les photos de réalisations

Les photos de la galerie "Nos réalisations" reçoivent un filigrane
semi-transparent **« SHOP PRO »** avant d'être envoyées au backend (même
mécanique que HANNIFA/Paradis-Services, texte et couleurs adaptés) :

1. La photo choisie est chargée dans un `<canvas>` HTML5 (`src/lib/watermark.ts`, `applyWatermark()`).
2. Un bandeau semi-transparent bleu marine + le texte « SHOP PRO » (sceau
   bleu électrique) sont dessinés dans le coin choisi (bas-droite par défaut).
3. Le canvas est reconverti en `File` (JPEG/PNG selon le fichier d'origine).
4. Ce fichier filigrané est celui envoyé à `uploadImage()` (`POST
   /uploads/image`, 25 Mo max).

Composant : `src/components/PhotoUploadWithWatermark.tsx`.

### Distinction importante : logo client vs photo de réalisation

Le **logo d'un établissement** ou le **fichier de personnalisation** fourni
par un client dans les formulaires de commande/devis (`/produits/:id`,
`/commande-groupee`) est envoyé **tel quel, sans filigrane** — ce fichier
appartient au client, pas à SHOP PRO. Composant dédié :
`src/components/PhotoUploadPlain.tsx`. Le filigrane « SHOP PRO » ne doit
jamais être appliqué à ce type de fichier — seulement aux photos de
réalisations de la galerie.

## Fonctionnalité clé : partage réseaux sociaux

Sur la fiche produit et dans la galerie, un menu de partage
(`src/components/ShareMenu.tsx`) propose :

- **WhatsApp** (`https://wa.me/?text=...`)
- **Facebook** (`https://www.facebook.com/sharer/sharer.php?u=...`)
- **X / Twitter** (`https://twitter.com/intent/tweet?text=...&url=...`)
- **Copier le lien** (`navigator.clipboard`)

Aucun SDK tiers — uniquement des URL d'intent standard.

## Bouton WhatsApp flottant

Comme sur HANNIFA, un bouton WhatsApp vert flottant est visible sur toutes
les pages (`src/App.tsx`, `WhatsAppFloat`), pointant vers
`https://wa.me/221773669721` (numéro principal de M. NDAO, 77 366 97 21, au
format international). Un second lien WhatsApp contextuel apparaît dans le
header, sur la fiche produit (avec le nom du produit pré-rempli dans le
message) et sur les pages de confirmation de commande/devis.

## Pas de paiement en ligne (V1)

Conformément au cahier des charges (section 19 "Évolutions possibles"), le
paiement en ligne (CinetPay) n'est **pas** activé en V1. `initPayment()`
existe dans `src/services/abmcy.ts` (générique, hérité du pattern
Paradis-Services) mais n'est appelé par aucune page. La confirmation de
paiement est **manuelle** après la commande (section 10) : espèces, Wave,
Orange Money ou virement, négociés directement avec l'équipe SHOP PRO par
téléphone ou WhatsApp — voir le récapitulatif affiché sur `/commander` et
dans le pied de page.

## Choix de design

- **Palette** : **bleu marine profond + blanc + bleu électrique**
  (`navy` / `ice` / `volt` dans `src/index.css`), inspirée des photos
  fournies par le client : tenues bleu marine et blanc avec bandes
  réfléchissantes, logos brodés d'écoles (ENSETP, CENSETP, Université de
  Dakar). Volontairement différente du beige/cognac "haute couture" de
  HANI'S et du bleu/terracotta "hôtellerie" de Paradis Services : ici
  l'objectif est "solidité, sérieux, personnalisation facile" — un bleu
  marine/bleu électrique façon tenue technique/uniforme — pas l'élégance
  raffinée d'une maison de couture.
- **Typographie** : `Space Grotesk` (sans-serif géométrique, pour les
  titres) + `Inter` (sans-serif très lisible, pour le corps de texte) —
  volontairement **pas de serif élégant** comme HANI'S (Fraunces/Cormorant) :
  ce n'est pas de la haute couture, c'est du vêtement professionnel/technique.
- **Logo** : placeholder purement SVG/CSS (carré à coin coupé + icône de
  vêtement inline), **aucun fichier image** — à remplacer par le vrai logo
  graphique SHOP PRO quand il existera (voir `src/components/Header.tsx`,
  composant `Logo`).
- Les coordonnées affichées (téléphone, WhatsApp) sont les **vraies**
  données fournies par le client (M. NDAO, 77 366 97 21 / 76 844 16 77) ;
  l'adresse e-mail et les liens Facebook/Instagram restent des
  **placeholders explicitement marqués `// TODO`** (`src/data/catalog.ts`,
  `src/components/Footer.tsx`, `src/pages/Contact.tsx`) — à remplacer par
  les vraies coordonnées avant mise en production.

## Ce qui n'a pas été repris de HANNIFA / Paradis-Services

Le sur-mesure "mesures corporelles / tissus" de HANI'S (maison de couture)
n'a pas de sens pour SHOP PRO (vêtements professionnels/scolaires
standardisés par taille, pas de patron au corps) — les routes backend
correspondantes (`/custom-orders`, `/measurements`, `/fabrics*`) existent
toujours côté ABMCY Core (backend générique multi-tenant) mais ne sont
**volontairement pas exposées** par ce frontend. La personnalisation SHOP
PRO (logo, texte, nom, numéro, filière, établissement) passe par
`products.attributes` et par le champ `notes` des commandes, pas par un vrai
module de mesures.

## Déploiement

Projet 100% statique après `npm run build` (`dist/`) — déployable sur
Vercel, Netlify, ou tout hébergeur de fichiers statiques. Le `HashRouter`
évite d'avoir à configurer une règle de réécriture SPA côté serveur.

## Statut

- `npm install`, `npm run typecheck` et `npm run build` passent sans erreur
  (vérifié dans cette conversation).
- Aucun tenant réel n'a été créé côté backend — `.env` reste vide par défaut
  (voir `.env.example`), le frontend est prêt mais pas encore branché à un
  vrai compte ABMCY. **Un tenant "shop-pro" doit être créé depuis le
  dashboard admin ABMCY (`business_type: commerce_general` recommandé) avant
  toute mise en ligne réelle**, avec `products_enabled`, `cart_enabled`,
  `reviews_enabled` et `gallery_enabled` activés.
