import { Link } from "react-router-dom";
import { Logo } from "./Header";
import { IconArrow, IconCheck, IconMail, IconPhone, IconPin, IconWhatsApp } from "./Icons";
import { CONTACT, SOCIALS } from "../data/catalog";
import { useState, type FormEvent } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative mt-28 bg-navy-900 text-ice-200">
      {/* liseré décoratif */}
      <div className="relative flex items-center gap-4 overflow-hidden px-8 pt-10">
        <div className="h-px flex-1 bg-ice-100/15" />
        <span className="font-display text-lg font-bold tracking-[0.3em] text-volt-300">SHOP PRO</span>
        <div className="h-px flex-1 bg-ice-100/15" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.1fr] lg:px-8">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-ice-300">
            Vêtements et tenues personnalisés au Sénégal : packs d'habillement
            en blouson, Lacoste personnalisés, tenues de travaux pratiques, et
            modèles d'habillement professionnel pour écoles, lycées, centres
            et établissements de formation.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.id}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-ice-100/20 text-ice-200 transition-all duration-300 hover:-translate-y-1 hover:border-volt-300 hover:text-volt-300"
              >
                {s.id === "whatsapp" ? <IconWhatsApp size={18} /> : <span className="text-xs font-semibold">{s.label[0]}</span>}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-volt-300">Navigation</h3>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/catalogue", label: "Nos produits" },
              { to: "/commande-groupee", label: "Commande groupée écoles" },
              { to: "/galerie", label: "Galerie de réalisations" },
              { to: "/comment-commander", label: "Comment commander ?" },
              { to: "/a-propos", label: "À propos de SHOP PRO" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="group inline-flex items-center gap-2 text-ice-300 transition-colors hover:text-volt-300"
                >
                  <span className="h-px w-0 bg-volt-300 transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-volt-300">Nos tenues</h3>
          <ul className="space-y-3 text-sm text-ice-300">
            {["Tenues de TP", "Pack blouson", "Lacostes personnalisés", "Uniformes d'établissement", "Sur mesure"].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="h-px w-4 bg-volt-300/60" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="eyebrow mb-5 !text-volt-300">Nous contacter</h3>
          <ul className="space-y-3.5 text-sm text-ice-300">
            <li className="flex items-start gap-3">
              <IconPin size={17} className="mt-0.5 shrink-0 text-volt-300" />
              Sénégal — intervention pour écoles et établissements partout dans le pays
            </li>
            <li className="flex items-center gap-3">
              <IconPhone size={17} className="shrink-0 text-volt-300" />
              <span>{CONTACT.phone1} / {CONTACT.phone2}</span>
            </li>
            <li className="flex items-center gap-3">
              <IconMail size={17} className="shrink-0 text-volt-300" />
              {/* TODO: remplacer par la vraie adresse email de contact SHOP PRO */}
              <span>contact@shop-pro.example</span>
            </li>
          </ul>

          <div className="mt-7">
            <p className="mb-3 text-[11px] uppercase tracking-[0.24em] text-ice-300">
              Infos & offres pour établissements
            </p>
            {subscribed ? (
              <p className="flex items-center gap-2 bg-navy-800 px-4 py-3 text-sm text-volt-300">
                <IconCheck size={16} /> Merci, vous êtes inscrit(e) !
              </p>
            ) : (
              <form onSubmit={onSubscribe} className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse e-mail"
                  className="w-full min-w-0 border border-ice-100/20 bg-navy-800 px-4 py-3 text-sm text-ice-100 outline-none placeholder:text-ice-300/50 focus:border-volt-300"
                />
                <button
                  type="submit"
                  aria-label="S'inscrire"
                  className="grid w-12 shrink-0 cursor-pointer place-items-center bg-volt-500 text-ice-50 transition-colors hover:bg-volt-400"
                >
                  <IconArrow size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-ice-100/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-6 sm:flex-row lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-ice-300">
            Confirmation de paiement manuelle après commande
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="rounded-[5px] border border-ice-100/25 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ice-200">
              Espèces à la livraison
            </span>
            <span className="rounded-[5px] border border-ice-100/25 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ice-200">
              Virement / dépôt
            </span>
            <span className="rounded-[5px] bg-[#1b9cd8] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ice-50">
              Wave
            </span>
            <span className="rounded-[5px] bg-[#e8710a] px-3 py-1.5 text-[11px] font-semibold tracking-wide text-ice-50">
              Orange Money
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-ice-100/10 py-5 text-center text-[12px] tracking-wide text-ice-300/70">
        © {new Date().getFullYear()} SHOP PRO — Tous droits réservés
        <span className="mx-2 text-volt-300">✦</span>
        Responsable : {CONTACT.responsable}
      </div>
    </footer>
  );
}
