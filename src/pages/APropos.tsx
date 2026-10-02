import { Link } from "react-router-dom";
import { CONTACT } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconRuler, IconSchool, IconShield } from "../components/Icons";

export default function APropos() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">À propos</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">SHOP PRO</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-700">
          SHOP PRO est une entreprise sénégalaise spécialisée dans la vente de
          vêtements et tenues personnalisés : packs d'habillement en blouson,
          Lacoste personnalisés, tenues de travaux pratiques (TP), et modèles
          d'habillement professionnel pour écoles, lycées, centres et
          établissements de formation professionnelle.
        </p>
        <p className="mt-4 max-w-2xl text-navy-600">
          Notre priorité : la solidité des tenues et la simplicité de la
          personnalisation — logo, texte, nom, numéro, filière ou
          établissement — pour que chaque commande, individuelle ou groupée,
          reflète exactement ce qui est demandé.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 sm:grid-cols-3">
        <Reveal className="rounded-[8px] border border-ice-300 bg-ice-50/60 p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconRuler size={22} />
          </span>
          <p className="font-display mt-5 text-xl font-semibold text-navy-900">Personnalisation</p>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            Chaque tenue peut être adaptée : logo brodé ou imprimé, texte, nom, numéro, couleurs.
          </p>
        </Reveal>
        <Reveal delay={90} className="rounded-[8px] border border-ice-300 bg-ice-50/60 p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconSchool size={22} />
          </span>
          <p className="font-display mt-5 text-xl font-semibold text-navy-900">Écoles & centres</p>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            Des établissements comme l'ENSETP, le CENSETP ou l'Université de Dakar nous font confiance pour leurs uniformes.
          </p>
        </Reveal>
        <Reveal delay={180} className="rounded-[8px] border border-ice-300 bg-ice-50/60 p-7">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-navy-800 text-ice-100">
            <IconShield size={22} />
          </span>
          <p className="font-display mt-5 text-xl font-semibold text-navy-900">Fiabilité</p>
          <p className="mt-2 text-sm leading-relaxed text-navy-600">
            Un interlocuteur direct, {CONTACT.responsable}, joignable par téléphone et WhatsApp pour chaque commande.
          </p>
        </Reveal>
      </div>

      <Reveal className="mt-16 rounded-[10px] border border-ice-300 bg-ice-50 p-8">
        <p className="eyebrow">Notre identité</p>
        <p className="mt-3 text-navy-700 leading-relaxed">
          Bleu marine, blanc et bandes réfléchissantes : SHOP PRO s'inspire
          directement des tenues techniques et professionnelles que nous
          confectionnons — pas de l'élégance de la haute couture, mais la
          solidité et le sérieux d'un vêtement de travail bien pensé.
        </p>
      </Reveal>

      <div className="mt-14 text-center">
        <Link to="/catalogue" className="btn-primary">
          Découvrir nos produits <IconArrow size={16} />
        </Link>
      </div>
    </div>
  );
}
