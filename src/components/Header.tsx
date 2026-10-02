import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { IconBag, IconClose, IconMenu, IconSparkle, IconWhatsApp } from "./Icons";
import { CONTACT } from "../data/catalog";

/**
 * Logo texte/SVG généré en CSS (pas de fichier image) — placeholder clair à
 * remplacer par un vrai logo graphique SHOP PRO plus tard. Le sceau "SP" est
 * un simple carré à coin coupé (notch) en SVG inline, évoquant une étiquette
 * de vêtement technique.
 */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="SHOP PRO — accueil">
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-[10px] ring-1 transition-colors duration-300 ${
          light ? "bg-volt-500 ring-ice-100/30" : "bg-navy-800 ring-navy-800/15"
        }`}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 4 5 7l1.8 2.4L8 8.7V20h8V8.7l1.2.7L19 7l-3.5-3-1.8 1.6h-3.4L8.5 4Z" />
        </svg>
      </span>
      <span className="leading-none">
        <span
          className={`font-display block text-[22px] font-bold tracking-[0.04em] ${
            light ? "text-ice-100" : "text-navy-900"
          }`}
        >
          SHOP PRO
        </span>
        <span
          className={`mt-1 block text-[8.5px] font-semibold uppercase tracking-[0.36em] ${
            light ? "text-ice-300" : "text-navy-500"
          }`}
        >
          Tenues pro & scolaires
        </span>
      </span>
    </Link>
  );
}

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/catalogue", label: "Nos produits" },
  { to: "/commande-groupee", label: "Écoles & centres" },
  { to: "/galerie", label: "Galerie" },
  { to: "/comment-commander", label: "Comment commander ?" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const { cartCount, setCartOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* bandeau annonce */}
      <div className="relative z-[60] flex items-center justify-center gap-2 bg-navy-900 px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.22em] text-ice-200">
        <IconSparkle size={11} className="shrink-0 text-volt-400" />
        <span className="hidden sm:inline">Tenues personnalisées pour écoles, centres et établissements — Sénégal</span>
        <span className="sm:hidden">Tenues personnalisées — Sénégal</span>
        <IconSparkle size={11} className="shrink-0 text-volt-400" />
      </div>

      <header
        className={`sticky top-0 z-[55] border-b transition-all duration-500 ${
          scrolled
            ? "border-ice-300/80 bg-ice-100/95 shadow-[0_10px_40px_-18px_rgba(9,28,61,0.35)] backdrop-blur-md"
            : "border-transparent bg-ice-100/60 backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 lg:px-8">
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `relative py-1 text-[12px] font-semibold uppercase tracking-[0.16em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-volt-500 after:transition-transform after:duration-300 hover:text-volt-600 hover:after:scale-x-100 ${
                    isActive ? "text-volt-600 after:scale-x-100" : "text-navy-700"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contacter SHOP PRO sur WhatsApp"
              className="hidden h-11 cursor-pointer items-center gap-2 rounded-full bg-[#1f8f52] px-4 text-[12px] font-semibold text-ice-50 transition-all duration-300 hover:bg-[#1a7a46] sm:flex"
            >
              <IconWhatsApp size={17} /> WhatsApp
            </a>
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Ouvrir ma commande"
              className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-full text-navy-800 transition-all duration-300 hover:bg-navy-800 hover:text-ice-100"
            >
              <IconBag />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-volt-500 px-1 text-[10px] font-semibold text-ice-50">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              className="grid h-11 w-11 cursor-pointer place-items-center rounded-full text-navy-800 transition-colors hover:bg-navy-800 hover:text-ice-100 lg:hidden"
            >
              <IconMenu />
            </button>
          </div>
        </div>
      </header>

      {/* menu mobile */}
      <div
        className={`fixed inset-0 z-[85] transition-opacity duration-400 lg:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="absolute inset-0 bg-navy-950/60" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-0 right-0 flex h-full w-[86%] max-w-sm flex-col bg-navy-900 text-ice-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-ice-100/10 px-6 py-5">
            <span className="eyebrow !text-volt-300">Menu</span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-ice-100/10"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-6">
            {NAV.map((n, i) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                style={{ transitionDelay: menuOpen ? `${120 + i * 60}ms` : "0ms" }}
                className={({ isActive }) =>
                  `font-display border-b border-ice-100/8 py-4 text-2xl font-semibold transition-all duration-500 ${
                    menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
                  } ${isActive ? "text-volt-300" : "text-ice-100 hover:text-volt-300"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-3 self-start bg-[#1f8f52] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.22em] text-ice-50 transition-colors hover:bg-[#1a7a46]"
            >
              <IconWhatsApp size={16} /> WhatsApp
            </a>
          </nav>
          <div className="border-t border-ice-100/10 px-6 py-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-ice-300">
              {CONTACT.responsable} — {CONTACT.phone1} / {CONTACT.phone2}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
