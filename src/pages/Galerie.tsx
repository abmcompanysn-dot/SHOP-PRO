import { useEffect, useMemo, useState } from "react";
import { listGallery, type GalleryItem } from "../services/abmcy";
import { FALLBACK_GALLERY } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import ShareMenu from "../components/ShareMenu";
import { IconChevron, IconClose } from "../components/Icons";

/** Même repli que FALLBACK_PRODUCTS (voir data/catalog.ts) : tant que le
 * vrai tenant backend n'existe pas, on affiche de vraies photos SHOP PRO
 * plutôt qu'une galerie vide. */
const FALLBACK_ITEMS: GalleryItem[] = FALLBACK_GALLERY.map((g) => ({
  id: g.id,
  title: g.caption,
  category: "realisation",
  image_url: g.image,
}));

const CATEGORY_LABEL: Record<string, string> = {
  tp: "Tenues de TP",
  blouson: "Pack blouson",
  lacoste: "Lacostes",
  etablissement: "Établissements",
  realisation: "Réalisations",
};

/**
 * Galerie de réalisations SHOP PRO — même pattern que Paradis-Services
 * (filtre par catégorie, lightbox clavier/flèches, partage social). Les
 * photos de cette galerie doivent toutes être filigranées "SHOP PRO" avant
 * upload (voir PhotoUploadWithWatermark.tsx) — ce qui est fait depuis le
 * dashboard tenant, pas depuis ce frontend public en lecture seule.
 */
export default function Galerie() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("Toutes");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await listGallery();
        if (!cancelled) setItems(data.length > 0 ? data : FALLBACK_ITEMS);
      } catch {
        if (!cancelled) setItems(FALLBACK_ITEMS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["Toutes", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(
    () => (category === "Toutes" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filtered.length]);

  const active = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Galerie</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">
          Nos réalisations
        </h1>
        <p className="mt-4 max-w-xl text-navy-600">
          Un aperçu réel des tenues confectionnées pour nos clients, écoles et
          établissements partenaires.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`chip ${category === c ? "chip-on" : ""}`}
          >
            {CATEGORY_LABEL[c] || c}
          </button>
        ))}
      </div>

      {loading && <p className="mt-16 text-center text-navy-500">Chargement de la galerie…</p>}
      {!loading && filtered.length === 0 && (
        <p className="mt-16 text-center text-navy-500">
          Aucune photo publiée pour le moment — revenez bientôt pour découvrir nos réalisations.
        </p>
      )}

      {!loading && filtered.length > 0 && (
        <div className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
          {filtered.map((item, i) => (
            <Reveal key={item.id} delay={(i % 8) * 50} className="break-inside-avoid overflow-hidden rounded-[6px]">
              <button onClick={() => setLightboxIndex(i)} className="block w-full cursor-zoom-in">
                <img src={item.image_url} alt={item.title} className="w-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              </button>
            </Reveal>
          ))}
        </div>
      )}

      {active && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy-950/92 px-4 py-10">
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Fermer"
            className="absolute top-5 right-5 grid h-11 w-11 cursor-pointer place-items-center rounded-full text-ice-100 hover:bg-ice-100/10"
          >
            <IconClose />
          </button>

          <button
            onClick={() => setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
            aria-label="Précédent"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ice-100 hover:bg-ice-100/10 sm:left-6"
          >
            <IconChevron size={22} className="rotate-90" />
          </button>
          <button
            onClick={() => setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
            aria-label="Suivant"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-ice-100 hover:bg-ice-100/10 sm:right-6"
          >
            <IconChevron size={22} className="-rotate-90" />
          </button>

          <img src={active.image_url} alt={active.title} className="max-h-[70vh] max-w-full rounded-[6px] object-contain shadow-2xl" />
          <div className="mt-5 flex flex-col items-center gap-3 text-center">
            <p className="text-ice-100">{active.title}</p>
            <ShareMenu text={`${active.title} — via SHOP PRO`} />
          </div>
        </div>
      )}
    </div>
  );
}
