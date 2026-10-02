import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, listProducts, type UploadResult } from "../services/abmcy";
import { mapProduct, mapProducts } from "../lib/mapProduct";
import { FALLBACK_PRODUCTS, fmtPrice, KIND_LABEL, CONTACT, type Listing } from "../data/catalog";
import { useStore } from "../context/StoreContext";
import { Reveal } from "../components/Reveal";
import ListingCard from "../components/ListingCard";
import ShareMenu from "../components/ShareMenu";
import PhotoUploadPlain from "../components/PhotoUploadPlain";
import { IconArrow, IconCheck, IconWhatsApp } from "../components/Icons";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [establishment, setEstablishment] = useState("");
  const [logo, setLogo] = useState<UploadResult | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    async function load() {
      // Repli : les produits de référence (ref-*) vivent côté frontend tant
      // que le vrai tenant n'est pas provisionné — on les sert directement.
      const fallback = FALLBACK_PRODUCTS.find((p) => p.id === id);
      if (fallback) {
        if (!cancelled) {
          setListing(fallback);
          setSize(fallback.sizes[0] || "");
          setColor(fallback.colors[0] || "");
          setSimilar(FALLBACK_PRODUCTS.filter((p) => p.id !== fallback.id).slice(0, 3));
          setLoading(false);
        }
        return;
      }

      try {
        const product = await getProduct(id!);
        if (cancelled) return;
        const mapped = mapProduct(product);
        setListing(mapped);
        setSize(mapped.sizes[0] || "");
        setColor(mapped.colors[0] || "");

        const siblings = await listProducts({ category: product.category }).catch(() => []);
        if (!cancelled) {
          setSimilar(mapProducts(siblings).filter((l) => l.id !== mapped.id).slice(0, 3));
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-3xl px-5 py-32 text-center text-navy-500">Chargement…</p>;
  }

  if (notFound || !listing) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-32 text-center">
        <p className="font-display text-4xl font-bold text-navy-900">Produit introuvable</p>
        <p className="mt-4 text-navy-500">Ce produit n'existe plus ou a été retiré.</p>
        <Link to="/catalogue" className="btn-primary mt-8">Retour au catalogue</Link>
      </div>
    );
  }

  const isQuote = listing.price === null;

  function buildDetail() {
    const parts = [size && `Taille ${size}`, color && color];
    return parts.filter(Boolean).join(" · ");
  }

  function buildCustomizationNote() {
    const parts = [
      customText && `Texte/nom/numéro : ${customText}`,
      establishment && `Établissement/filière : ${establishment}`,
      logo && `Logo joint : ${logo.url}`,
      comment && `Commentaire : ${comment}`,
    ];
    return parts.filter(Boolean).join(" — ");
  }

  function onAddToCart() {
    addToCart(
      {
        key: `${listing!.id}-${size}-${color}-${Date.now()}`,
        productId: listing!.id,
        name: listing!.name,
        detail: buildDetail(),
        price: listing!.price ?? 0,
        image: listing!.image,
        size,
        color,
        customization: buildCustomizationNote(),
        isQuote,
      },
      qty
    );
  }

  function onOrderOrQuote() {
    onAddToCart();
    navigate("/commander");
  }

  const shareText = `${listing.name} — ${fmtPrice(listing.price)} — via SHOP PRO`;
  const whatsappText = encodeURIComponent(
    `Bonjour SHOP PRO, je souhaite commander : ${listing.name}${size ? ` (taille ${size})` : ""}${color ? ` — ${color}` : ""}.`
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-2">
        <Reveal className="overflow-hidden rounded-[10px] border border-ice-300">
          <img src={listing.image} alt={listing.name} className="aspect-[4/3] w-full object-cover" style={{ objectPosition: listing.objectPos }} />
        </Reveal>

        <Reveal delay={80}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-navy-500">
            {KIND_LABEL[listing.kind]}
          </p>
          <h1 className="font-display mt-2 text-4xl font-bold text-navy-900">{listing.name}</h1>
          <p className="mt-3 text-2xl font-bold text-volt-600">{fmtPrice(listing.price)}</p>

          <p className="mt-6 leading-relaxed text-navy-700">{listing.description}</p>

          {listing.sizes.length > 0 && (
            <div className="mt-6">
              <p className="label">Taille</p>
              <div className="flex flex-wrap gap-2">
                {listing.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`chip ${size === s ? "chip-on" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {listing.colors.length > 0 && (
            <div className="mt-5">
              <p className="label">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {listing.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`chip ${color === c ? "chip-on" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* zone de personnalisation */}
          <div className="mt-7 rounded-[8px] border border-ice-300 bg-ice-50/70 p-5">
            <p className="label !mb-3">Personnalisation</p>
            <div className="space-y-4">
              <div>
                <label className="label" htmlFor="customText">Nom, numéro ou texte à inscrire</label>
                <input
                  id="customText"
                  className="field"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex : DIOP 12, ou le nom de l'étudiant"
                />
              </div>
              <div>
                <label className="label" htmlFor="establishment">Établissement / filière (si applicable)</label>
                <input
                  id="establishment"
                  className="field"
                  value={establishment}
                  onChange={(e) => setEstablishment(e.target.value)}
                  placeholder="Ex : ENSETP — Génie Mécanique"
                />
              </div>
              <PhotoUploadPlain
                label="Logo à broder/imprimer (optionnel)"
                hint="Votre fichier est envoyé tel quel, sans filigrane — il reste le vôtre."
                onUploaded={(result) => setLogo(result)}
              />
              <div>
                <label className="label" htmlFor="comment">Commentaire (optionnel)</label>
                <textarea
                  id="comment"
                  className="field min-h-24 resize-y"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Précisions utiles : emplacement du logo, délai souhaité..."
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-ice-300">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-11 w-11 cursor-pointer place-items-center hover:bg-ice-200"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-11 w-11 cursor-pointer place-items-center hover:bg-ice-200"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
            <button onClick={onOrderOrQuote} className="btn-primary flex-1">
              <IconCheck size={16} /> {isQuote ? "Demander un devis" : "Commander"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={onAddToCart} className="btn-ghost">
              Ajouter sans commander maintenant
            </button>
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#1f8f52] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-ice-50 transition-colors hover:bg-[#1a7a46]"
            >
              <IconWhatsApp size={16} /> WhatsApp direct
            </a>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <ShareMenu text={shareText} />
          </div>
        </Reveal>
      </div>

      {similar.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <p className="eyebrow">Vous pourriez aussi aimer</p>
            <h2 className="font-display mt-2 text-3xl font-bold text-navy-900">Produits similaires</h2>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s, i) => (
              <ListingCard key={s.id} listing={s} delay={i * 80} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-16 text-center">
        <Link to="/catalogue" className="btn-ghost">
          <IconArrow size={16} className="rotate-180" /> Retour au catalogue
        </Link>
      </div>
    </div>
  );
}
