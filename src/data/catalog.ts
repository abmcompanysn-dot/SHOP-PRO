/**
 * Données éditoriales fixes (catégories, tailles, couleurs suggérées,
 * témoignages, étapes de commande) + produits de RÉFÉRENCE côté frontend
 * uniquement, en attendant la création du vrai tenant "shop-pro" côté
 * backend ABMCY. Ces produits de référence ne sont PAS envoyés à l'API —
 * ils servent juste à afficher un catalogue crédible tant qu'aucune vraie
 * annonce n'existe encore (voir Home.tsx / Catalogue.tsx : si l'appel API
 * échoue ou renvoie une liste vide, on retombe sur FALLBACK_PRODUCTS).
 * Une fois le tenant provisionné, les vraies annonces créées depuis le
 * dashboard tenant remplaceront naturellement ce repli.
 */

export type ProductKind = "tp" | "blouson" | "lacoste" | "etablissement" | "autre";

export type Listing = {
  id: string;
  name: string;
  kind: ProductKind;
  price: number | null; // null = "Sur devis"
  image: string;
  objectPos?: string;
  description: string;
  sizes: string[];
  colors: string[];
  isNew?: boolean;
  isBest?: boolean;
};

export const KIND_LABEL: Record<ProductKind, string> = {
  tp: "Tenues de TP",
  blouson: "Pack habillement blouson",
  lacoste: "Lacostes personnalisés",
  etablissement: "Tenues pour établissements",
  autre: "Autres modèles / sur mesure",
};

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Sur mesure enfant"];

export const SUGGESTED_COLORS = [
  "Bleu marine",
  "Blanc",
  "Bleu ciel",
  "Gris",
  "Noir",
  "Bandes réfléchissantes",
];

/**
 * Produits de référence donnés par le client (section "Produits" du cahier
 * des charges) — prix affichés quand connus, "Sur devis" sinon. Images :
 * vraies photos de réalisations SHOP PRO fournies par le client
 * (public/images/), en attendant que le vrai catalogue soit géré depuis
 * le dashboard tenant une fois le compte backend créé.
 */
export const FALLBACK_PRODUCTS: Listing[] = [
  {
    id: "ref-tp",
    name: "Tenue de TP personnalisée",
    kind: "tp",
    price: 16000,
    image: "/images/produit-tenue-tp-pliee.jpg",
    description:
      "Tenue de travaux pratiques robuste, personnalisable avec le logo, le nom et la filière de l'élève ou de l'étudiant. Idéale pour les centres de formation professionnelle, lycées techniques et établissements universitaires.",
    sizes: SIZES,
    colors: ["Bleu marine", "Gris"],
    isBest: true,
  },
  {
    id: "ref-blouson",
    name: "Pack habillement blouson (5 pièces)",
    kind: "blouson",
    price: 25000,
    image: "/images/produit-pack-blouson.jpg",
    description:
      "Pack complet de 5 pièces d'habillement en blouson, personnalisable aux couleurs et au logo de votre établissement ou de votre promotion. Tarif de groupe disponible sur devis au-delà de 10 pièces.",
    sizes: SIZES,
    colors: ["Bleu marine", "Blanc", "Bleu ciel"],
    isNew: true,
  },
  {
    id: "ref-lacoste",
    name: "Lacoste personnalisé",
    kind: "lacoste",
    price: null,
    image: "/images/produit-lacoste-ensetp.jpg",
    description:
      "Polo Lacoste personnalisé avec logo brodé, nom et numéro — parfait pour une promotion, une classe ou une équipe. Tarif selon quantité et complexité de la broderie : demandez votre devis.",
    sizes: SIZES,
    colors: ["Bleu marine", "Blanc", "Gris"],
  },
  {
    id: "ref-etablissement",
    name: "Tenues professionnelles sur mesure pour établissements",
    kind: "etablissement",
    price: null,
    image: "/images/produit-combinaison-pro.jpg",
    description:
      "Uniformes complets pour écoles, lycées, centres et établissements de formation professionnelle (type ENSETP, CENSETP, Université de Dakar) — logo brodé, bandes réfléchissantes, répartition de tailles par classe ou promotion.",
    sizes: SIZES,
    colors: ["Bleu marine", "Blanc", "Bandes réfléchissantes"],
    isBest: true,
  },
  {
    id: "ref-autre",
    name: "Autres modèles sur mesure",
    kind: "autre",
    price: null,
    image: "/images/realisation-groupe-atelier.jpg",
    description:
      "Un besoin spécifique non listé ici ? Décrivez votre projet (type de tenue, quantité, logo, couleurs) et recevez un devis adapté.",
    sizes: SIZES,
    colors: SUGGESTED_COLORS,
  },
];

/**
 * Photos de réalisations (tenues portées, commandes livrées) — pour la
 * page Galerie, distinctes des photos produit ci-dessus.
 */
export const FALLBACK_GALLERY = [
  {
    id: "g-1",
    image: "/images/realisation-tenue-tp-atelier.jpg",
    caption: "Tenue de TP en situation — atelier mécanique",
  },
  {
    id: "g-2",
    image: "/images/realisation-survetement-duo.jpg",
    caption: "Survêtement personnalisé — établissement universitaire",
  },
  {
    id: "g-3",
    image: "/images/realisation-tenue-sport-duo.jpg",
    caption: "Tenue de sport personnalisée",
  },
  {
    id: "g-4",
    image: "/images/realisation-groupe-atelier.jpg",
    caption: "Commande groupée livrée — centre de formation",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Nous avons équipé toute notre promotion de tenues de TP avec le logo de l'école — qualité solide et livraison dans les délais annoncés.",
    name: "Responsable filière, ENSETP",
    city: "Dakar",
  },
  {
    quote:
      "Le pack blouson personnalisé pour notre centre a été très apprécié des étudiants. Service sérieux, suivi clair de la commande.",
    name: "Directeur des études",
    city: "Thiès",
  },
  {
    quote:
      "Commande groupée simple à organiser : un seul formulaire pour toute la classe, avec la répartition des tailles. Pratique pour un responsable d'établissement.",
    name: "Surveillant général",
    city: "Rufisque",
  },
];

export const ORDER_STAGES = [
  { key: "recorded", label: "Commande / devis enregistré" },
  { key: "confirmed", label: "Confirmée par l'équipe" },
  { key: "making", label: "Confection en cours" },
  { key: "shipped", label: "Prête / en livraison" },
  { key: "delivered", label: "Livrée" },
];

export const fmtPrice = (n: number | null) => (n === null ? "Sur devis" : `${n.toLocaleString("fr-FR")} F`);

/**
 * Coordonnées de contact — numéros réels fournis par le client (M. NDAO).
 */
export const CONTACT = {
  responsable: "M. NDAO",
  phone1: "77 366 97 21",
  phone2: "76 844 16 77",
  whatsappNumber: "221773669721", // format international pour wa.me, basé sur le numéro principal
};

/**
 * Réseaux sociaux — placeholders explicites à remplacer par les vrais
 * comptes SHOP PRO quand ils existeront.
 */
export const SOCIALS = [
  { id: "facebook", label: "Facebook", href: "#" }, // TODO: lien réel de la page Facebook SHOP PRO
  { id: "instagram", label: "Instagram", href: "#" }, // TODO: lien réel du compte Instagram SHOP PRO
  { id: "whatsapp", label: "WhatsApp", href: `https://wa.me/${CONTACT.whatsappNumber}` },
];
