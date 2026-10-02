/**
 * Adaptateur Product API ABMCY -> Listing tel qu'attendu par l'UI (tenues
 * personnalisées, packs, modèles). Le backend ABMCY Core est générique :
 * `products.category` vaut "tp" | "blouson" | "lacoste" | "etablissement" |
 * "autre", et tout le reste (tailles, couleurs, options de personnalisation)
 * vit librement dans `products.attributes` (JSONB, aucune colonne dédiée
 * côté backend).
 *
 * IMPORTANT (piège déjà rencontré sur HANNIFA et Paradis-Services) : la photo
 * d'un produit vient de `p.images?.[0]?.url` (tableau `product_images`
 * renvoyé par GET /products), PAS d'un champ `image_url` à plat qui
 * n'existe pas dans la réponse API. On ne lit `attrs.image_url` qu'en
 * dernier repli, pour les tout premiers produits éventuellement créés sans
 * passer par le flux d'upload normal.
 *
 * Repli défensif : un produit créé depuis le dashboard tenant ou via l'API
 * n'est pas forcément enrichi de la même façon qu'un autre — on ne fait
 * jamais planter l'affichage, on dégrade proprement (tailles/couleurs
 * vides, prix affiché "Sur devis" si absent ou à 0).
 */
import type { Product as ApiProduct } from "../services/abmcy";
import type { Listing, ProductKind } from "../data/catalog";

const FALLBACK_IMAGE = "/images/produit-placeholder.svg";

const VALID_KINDS: ProductKind[] = ["tp", "blouson", "lacoste", "etablissement", "autre"];

function normalizeKind(category: string | undefined): ProductKind {
  if (category && (VALID_KINDS as string[]).includes(category)) {
    return category as ProductKind;
  }
  return "autre";
}

/** Transforme un produit brut de l'API ABMCY en tenue compatible avec l'UI. */
export function mapProduct(p: ApiProduct): Listing {
  const attrs = p.attributes || {};

  const sizes: string[] = Array.isArray(attrs.sizes) ? attrs.sizes : [];
  const colors: string[] = Array.isArray(attrs.colors) ? attrs.colors : [];

  // p.images[] (table product_images) est la source de vérité — jamais un
  // champ image_url à plat, qui n'existe pas dans la réponse de l'API.
  const image = p.images?.[0]?.url || attrs.image_url || FALLBACK_IMAGE;

  return {
    id: p.id,
    name: p.name,
    kind: normalizeKind(p.category),
    // sur_devis prime sur le prix numérique : le backend refuse price <= 0
    // à la création (voir internal/catalog/products.go), donc un produit
    // "sur devis" est forcément enregistré avec un prix symbolique non nul
    // — c'est l'attribut qui fait foi, pas la valeur de price elle-même.
    price: attrs.sur_devis || !(typeof p.price === "number" && p.price > 0) ? null : p.price,
    image,
    objectPos: attrs.objectPos,
    description: p.description || attrs.summary || p.name,
    sizes,
    colors,
    isNew: !!attrs.isNew,
    isBest: !!attrs.isBest || !!p.is_featured,
  };
}

export function mapProducts(list: ApiProduct[]): Listing[] {
  return list.map(mapProduct);
}

/**
 * Transforme une tenue du formulaire "Ajouter un produit" (dashboard tenant,
 * pas encore construit ici) vers les champs attendus par createProduct().
 * Gardé pour cohérence avec le pattern Paradis-Services/HANNIFA — SHOP PRO
 * n'expose pas de formulaire de publication public (ce n'est pas une
 * marketplace, c'est un catalogue propriétaire), mais la même convention
 * `attributes` doit être respectée par le futur dashboard tenant.
 */
export function listingToProductPayload(input: {
  name: string;
  kind: ProductKind;
  price: number | null;
  description: string;
  sizes: string[];
  colors: string[];
}) {
  return {
    name: input.name,
    price: input.price ?? 0,
    category: input.kind,
    description: input.description,
    attributes: {
      sizes: input.sizes,
      colors: input.colors,
    },
  };
}
