import { CONTACT } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import { IconMail, IconPhone, IconPin, IconWhatsApp } from "../components/Icons";

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">Nous contacter</h1>
        <p className="mt-4 max-w-xl text-navy-600">
          Une question, une commande, un devis pour votre établissement ?
          {" "}{CONTACT.responsable} et l'équipe SHOP PRO vous répondent
          directement.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <Reveal className="flex items-start gap-4 rounded-[8px] border border-ice-300 bg-ice-50/60 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconPhone size={20} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">Téléphone</p>
            <p className="mt-1 text-navy-600">{CONTACT.phone1}</p>
            <p className="text-navy-600">{CONTACT.phone2}</p>
          </div>
        </Reveal>

        <Reveal delay={80} className="flex items-start gap-4 rounded-[8px] border border-ice-300 bg-ice-50/60 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1f8f52] text-ice-100">
            <IconWhatsApp size={20} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">WhatsApp</p>
            <p className="mt-1 text-navy-600">Réponse rapide pour toute commande ou devis.</p>
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 bg-[#1f8f52] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-ice-50 transition-colors hover:bg-[#1a7a46]"
            >
              <IconWhatsApp size={15} /> Discuter maintenant
            </a>
          </div>
        </Reveal>

        <Reveal delay={160} className="flex items-start gap-4 rounded-[8px] border border-ice-300 bg-ice-50/60 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconMail size={20} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">E-mail</p>
            {/* TODO: remplacer par la vraie adresse email de contact SHOP PRO */}
            <p className="mt-1 text-navy-600">contact@shop-pro.example</p>
          </div>
        </Reveal>

        <Reveal delay={240} className="flex items-start gap-4 rounded-[8px] border border-ice-300 bg-ice-50/60 p-6">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconPin size={20} />
          </span>
          <div>
            <p className="font-display text-lg font-semibold text-navy-900">Zone d'intervention</p>
            <p className="mt-1 text-navy-600">Sénégal — commandes et livraisons pour particuliers, écoles et établissements partout dans le pays.</p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
