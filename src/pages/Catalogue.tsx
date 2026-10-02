import { useEffect, useMemo, useState } from "react";
import { listProducts } from "../services/abmcy";
import { mapProducts } from "../lib/mapProduct";
import { FALLBACK_PRODUCTS, KIND_LABEL, type Listing, type ProductKind } from "../data/catalog";
import ListingCard from "../components/ListingCard";
import { Reveal } from "../components/Reveal";
import { IconChevron } from "../components/Icons";

type SortKey = "featured" | "new" | "price-asc" | "price-desc";
type KindFilter = "Tous" | ProductKind;

export default function Catalogue() {
  const [products, setProducts] = useState<Listing[]>(FALLBACK_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);
  const [kind, setKind] = useState<KindFilter>("Tous");
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const apiProducts = await listProducts();
        if (!cancelled && apiProducts.length > 0) {
          setProducts(mapProducts(apiProducts));
          setUsingFallback(false);
        }
      } catch {
        // Tenant pas encore créé/configuré — on garde les produits de
        // référence du cahier des charges comme repli, sans écran d'erreur.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const kinds = useMemo(() => {
    const set = new Set(products.map((p) => p.kind));
    return ["Tous" as const, ...Array.from(set)];
  }, [products]);

  const filtered = useMemo(() => {
    let list = kind === "Tous" ? products : products.filter((p) => p.kind === kind);
    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "price-desc":
        list = [...list].sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "new":
        list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      default:
        list = [...list].sort((a, b) => Number(b.isBest) - Number(a.isBest));
    }
    return list;
  }, [products, kind, sort]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Catalogue</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">
          Nos produits
        </h1>
        <p className="mt-4 max-w-xl text-navy-600">
          Tenues de TP, packs d'habillement en blouson, Lacostes personnalisés,
          tenues professionnelles pour établissements, et autres modèles sur
          mesure — filtrez par catégorie et triez selon vos priorités.
        </p>
      </Reveal>

      {!loading && usingFallback && (
        <p className="mt-6 text-sm text-navy-500">
          Produits de référence du cahier des charges — les vraies annonces
          SHOP PRO remplaceront cet aperçu une fois le compte ABMCY activé.
        </p>
      )}

      {/* filtres */}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {kinds.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`chip ${kind === k ? "chip-on" : ""}`}
          >
            {k === "Tous" ? "Tous" : KIND_LABEL[k]}
          </button>
        ))}

        <div className="relative ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="field w-auto cursor-pointer appearance-none pr-9 text-sm"
          >
            <option value="featured">Recommandés</option>
            <option value="new">Nouveautés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <IconChevron size={14} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-navy-500" />
        </div>
      </div>

      {/* résultats */}
      {loading && <p className="mt-16 text-center text-navy-500">Chargement du catalogue…</p>}
      {!loading && filtered.length === 0 && (
        <p className="mt-16 text-center text-navy-500">Aucun produit ne correspond à ce filtre pour le moment.</p>
      )}
      {!loading && filtered.length > 0 && (
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ListingCard key={p.id} listing={p} delay={(i % 8) * 60} />
          ))}
        </div>
      )}
    </div>
  );
}
