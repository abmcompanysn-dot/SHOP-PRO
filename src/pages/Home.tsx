import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listProducts, listGallery, type GalleryItem } from "../services/abmcy";
import { mapProducts } from "../lib/mapProduct";
import { FALLBACK_PRODUCTS, TESTIMONIALS, fmtPrice, type Listing, CONTACT } from "../data/catalog";
import ListingCard from "../components/ListingCard";
import { Reveal, MaskLines } from "../components/Reveal";
import {
  IconArrow,
  IconRuler,
  IconSchool,
  IconShield,
  IconStar,
  IconTruck,
  IconWhatsApp,
} from "../components/Icons";

const HIGHLIGHTS = [
  {
    icon: IconRuler,
    title: "Personnalisation facile",
    text: "Logo, texte, nom, numéro, filière ou établissement : chaque tenue est personnalisée selon vos besoins exacts.",
  },
  {
    icon: IconSchool,
    title: "Écoles & centres de formation",
    text: "Uniformes pour établissements (ENSETP, CENSETP, universités...), avec gestion de la répartition des tailles par classe.",
  },
  {
    icon: IconShield,
    title: "Solidité & sérieux",
    text: "Des tenues professionnelles et techniques pensées pour durer — pas de la haute couture, du vêtement de travail fiable.",
  },
  {
    icon: IconTruck,
    title: "Commande ou devis",
    text: "Commande directe pour les modèles à prix fixe, devis pour les quantités ou le sur-mesure d'établissement.",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Listing[]>(FALLBACK_PRODUCTS.slice(0, 4));
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [apiProducts, galleryItems] = await Promise.all([
          listProducts({ sort: "featured" }),
          listGallery().catch(() => []),
        ]);
        if (cancelled) return;
        if (apiProducts.length > 0) {
          setProducts(mapProducts(apiProducts).slice(0, 4));
          setUsingFallback(false);
        }
        setGallery(galleryItems.slice(0, 6));
      } catch {
        // Tenant pas encore créé/configuré côté backend — on garde les
        // produits de référence du cahier des charges comme repli.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-900 text-ice-100">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: "radial-gradient(ellipse 70% 60% at 80% 10%, rgba(13,110,253,0.35), transparent 60%)",
        }} />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 py-24 lg:flex-row lg:items-center lg:px-8 lg:py-32">
          <div className="flex-1">
            <p className="eyebrow !text-volt-300">SHOP PRO — Sénégal</p>
            <MaskLines
              className="font-display mt-4 text-5xl leading-[1.05] font-bold sm:text-6xl"
              lines={["Votre tenue.", "Votre logo.", "Votre établissement."]}
            />
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ice-300">
              SHOP PRO confectionne des tenues professionnelles et scolaires
              personnalisées : packs blouson, Lacoste, tenues de TP, et
              uniformes pour écoles, lycées et centres de formation.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/catalogue" className="btn-volt">
                Voir nos produits <IconArrow size={16} />
              </Link>
              <Link to="/commande-groupee" className="btn-ghost !border-ice-100/30 !text-ice-100 hover:!bg-ice-100 hover:!text-navy-900">
                Devis pour établissement
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#1f8f52] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-ice-50 transition-all duration-300 hover:bg-[#1a7a46] active:scale-[0.97]"
              >
                <IconWhatsApp size={16} /> WhatsApp
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-ice-300">
              <span>
                Tenue de TP dès <span className="font-semibold text-volt-300">{fmtPrice(16000)}</span>
              </span>
              <span>
                Pack blouson (5 pièces) <span className="font-semibold text-volt-300">{fmtPrice(25000)}</span>
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&q=80"
                alt="Tenue de travaux pratiques personnalisée"
                className="aspect-[3/4] translate-y-6 rounded-[10px] object-cover ring-1 ring-ice-100/10"
                loading="eager"
              />
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                alt="Uniforme d'établissement bleu marine et blanc"
                className="aspect-[3/4] rounded-[10px] object-cover ring-1 ring-ice-100/10"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="overflow-hidden border-y border-ice-300 bg-ice-200 py-3">
        <div className="animate-marquee flex w-max gap-10 text-[12px] font-semibold tracking-[0.2em] text-navy-600 uppercase">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>Tenues de TP</span>
              <span>·</span>
              <span>Pack blouson</span>
              <span>·</span>
              <span>Lacostes personnalisés</span>
              <span>·</span>
              <span>Uniformes d'établissement</span>
              <span>·</span>
              <span>Commandes groupées écoles</span>
              <span>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Pourquoi SHOP PRO</p>
          <h2 className="font-display mt-3 text-4xl font-bold text-navy-900">
            Des tenues solides, personnalisées, sans complication
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((h, i) => (
            <Reveal key={h.title} delay={i * 90} className="rounded-[8px] border border-ice-300 bg-ice-50/60 p-7">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-ice-100">
                <h.icon size={22} />
              </span>
              <p className="font-display mt-5 text-xl font-semibold text-navy-900">{h.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{h.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PRODUITS PHARES */}
      <section className="bg-ice-200/60 py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <p className="eyebrow">Produits phares</p>
              <h2 className="font-display mt-3 text-4xl font-bold text-navy-900">
                Nos modèles les plus demandés
              </h2>
            </Reveal>
            <Link to="/catalogue" className="btn-ghost">
              Tout le catalogue <IconArrow size={16} />
            </Link>
          </div>

          {!loading && usingFallback && (
            <p className="mt-6 text-sm text-navy-500">
              Produits de référence du cahier des charges — les vraies annonces
              SHOP PRO remplaceront cet aperçu une fois le compte activé.
            </p>
          )}

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p, i) => (
              <ListingCard key={p.id} listing={p} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* COMMANDES D'ÉCOLES */}
      <section className="relative overflow-hidden bg-navy-900 py-24 text-ice-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-5 text-center">
          <IconSchool size={32} className="text-volt-300" />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Vous représentez une école ou un centre de formation ?
          </h2>
          <p className="max-w-xl text-ice-300">
            Commandez les tenues de toute une classe ou promotion en une seule
            fois : logo d'établissement, répartition des tailles, filière,
            date de livraison souhaitée — un seul formulaire, un devis adapté
            aux grandes quantités.
          </p>
          <Link to="/commande-groupee" className="btn-light mt-2">
            Commande groupée établissement <IconArrow size={16} />
          </Link>
        </div>
      </section>

      {/* GALERIE TEASER */}
      {gallery.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow">Nos réalisations</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-navy-900">
              Des tenues déjà confectionnées
            </h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {gallery.map((g, i) => (
              <Reveal key={g.id} delay={i * 60} className="aspect-square overflow-hidden rounded-[6px]">
                <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
              </Reveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/galerie" className="btn-ghost">
              Voir toute la galerie <IconArrow size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* TÉMOIGNAGES */}
      <section className="bg-ice-200/60 py-24">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow">Ils nous font confiance</p>
            <h2 className="font-display mt-3 text-4xl font-bold text-navy-900">Avis récents</h2>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100} className="rounded-[8px] border border-ice-300 bg-ice-50 p-7">
                <div className="mb-3 flex gap-1 text-volt-500">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <IconStar key={s} size={14} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-navy-700 italic">"{t.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-navy-900">{t.name}</p>
                <p className="text-xs text-navy-500">{t.city}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal className="flex flex-col items-center justify-between gap-8 rounded-[10px] border border-ice-300 bg-ice-50 p-10 text-center lg:flex-row lg:text-left">
          <div>
            <h3 className="font-display text-3xl font-bold text-navy-900">
              Prêt à commander votre tenue personnalisée ?
            </h3>
            <p className="mt-2 text-navy-600">
              Tenue de TP dès <span className="font-semibold text-volt-600">{fmtPrice(16000)}</span>, pack
              blouson à <span className="font-semibold text-volt-600">{fmtPrice(25000)}</span> les 5 pièces.
            </p>
          </div>
          <Link to="/catalogue" className="btn-primary shrink-0">
            Voir nos produits <IconArrow size={16} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
