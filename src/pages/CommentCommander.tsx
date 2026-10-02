import { Link } from "react-router-dom";
import { CONTACT } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconCard, IconCheck, IconEdit, IconSchool, IconTruck, IconWhatsApp } from "../components/Icons";

const STEPS = [
  {
    icon: IconEdit,
    title: "1. Choisissez votre tenue",
    text: "Parcourez le catalogue (tenue de TP, pack blouson, Lacoste, uniforme d'établissement...) ou décrivez votre besoin sur mesure.",
  },
  {
    icon: IconCheck,
    title: "2. Personnalisez",
    text: "Indiquez taille, couleur, texte/nom/numéro, et joignez votre logo si besoin, directement depuis la fiche produit.",
  },
  {
    icon: IconSchool,
    title: "3. Commandez ou demandez un devis",
    text: "Prix fixe ? Commandez directement. Grande quantité ou sur mesure d'établissement ? Utilisez le formulaire de commande groupée pour recevoir un devis.",
  },
  {
    icon: IconCard,
    title: "4. Confirmation & paiement",
    text: "Notre équipe vous contacte par téléphone ou WhatsApp pour confirmer les détails. Le paiement (espèces, Wave, Orange Money, virement) est confirmé manuellement à ce moment — pas de paiement en ligne pour l'instant.",
  },
  {
    icon: IconTruck,
    title: "5. Confection & livraison",
    text: "Votre tenue est confectionnée puis livrée ou mise à disposition selon ce qui a été convenu avec vous.",
  },
];

export default function CommentCommander() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Processus de commande</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">Comment commander ?</h1>
        <p className="mt-4 max-w-2xl text-navy-600">
          Commander une tenue personnalisée chez SHOP PRO se fait en quelques
          étapes simples, que vous soyez un particulier ou le responsable
          d'un établissement.
        </p>
      </Reveal>

      <div className="mt-14 space-y-6">
        {STEPS.map((s, i) => (
          <Reveal key={s.title} delay={i * 80} className="flex gap-5 rounded-[8px] border border-ice-300 bg-ice-50/60 p-6">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-ice-100">
              <s.icon size={22} />
            </span>
            <div>
              <p className="font-display text-xl font-semibold text-navy-900">{s.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-navy-600">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16 flex flex-col items-center gap-6 rounded-[10px] border border-ice-300 bg-navy-900 p-10 text-center text-ice-100">
        <p className="font-display text-2xl font-bold">Une question avant de commander ?</p>
        <p className="max-w-lg text-ice-300">
          {CONTACT.responsable} et l'équipe SHOP PRO répondent directement par
          téléphone ou WhatsApp.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#1f8f52] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ice-50 transition-colors hover:bg-[#1a7a46]"
          >
            <IconWhatsApp size={16} /> WhatsApp
          </a>
          <Link to="/catalogue" className="btn-light">
            Voir le catalogue <IconArrow size={16} />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
