import { useEffect, useRef, useState } from "react";
import {
  IconCheck,
  IconFacebook,
  IconGlobe,
  IconShare,
  IconTwitterX,
  IconWhatsApp,
} from "./Icons";

type Props = {
  /** URL absolue de la page à partager. Par défaut : l'URL courante. */
  url?: string;
  /** Texte d'accompagnement (nom du produit, courte description...). */
  text: string;
  className?: string;
};

/**
 * Menu de partage réseaux sociaux réutilisable (WhatsApp, Facebook, X/Twitter,
 * copier le lien) — utilisé sur la fiche produit et dans la galerie.
 * Utilise uniquement les URL d'intent standard, sans SDK tiers.
 */
export default function ShareMenu({ url, text, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const links = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <IconWhatsApp size={17} />,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <IconFacebook size={17} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      id: "twitter",
      label: "X / Twitter",
      icon: <IconTwitterX size={17} />,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
        shareUrl
      )}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Repli silencieux : certains navigateurs refusent le clipboard hors HTTPS.
    }
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="chip"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <IconShare size={15} /> Partager
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-20 mt-2 w-56 rounded-[6px] border border-ice-300 bg-ice-50 p-2 shadow-[0_18px_44px_-16px_rgba(9,28,61,0.35)]"
        >
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              role="menuitem"
              className="flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-sm text-navy-800 transition-colors hover:bg-ice-200"
              onClick={() => setOpen(false)}
            >
              {l.icon} {l.label}
            </a>
          ))}
          <button
            onClick={copyLink}
            role="menuitem"
            className="flex w-full cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-left text-sm text-navy-800 transition-colors hover:bg-ice-200"
          >
            {copied ? <IconCheck size={17} /> : <IconGlobe size={17} />}
            {copied ? "Lien copié !" : "Copier le lien"}
          </button>
        </div>
      )}
    </div>
  );
}
