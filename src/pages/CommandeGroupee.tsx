import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { createOrder, type Order, type UploadResult } from "../services/abmcy";
import { SIZES, CONTACT, KIND_LABEL } from "../data/catalog";
import { Reveal } from "../components/Reveal";
import PhotoUploadPlain from "../components/PhotoUploadPlain";
import { IconArrow, IconCheck, IconSchool, IconWhatsApp } from "../components/Icons";

type TypeTenue = "tp" | "blouson" | "lacoste" | "etablissement" | "autre";

/**
 * Formulaire dédié "Commande groupée (écoles/établissements)" — section du
 * cahier des charges distincte de la commande individuelle : nom de
 * l'établissement, filière/classe/promotion, responsable, type de tenue,
 * nombre de personnes, répartition des tailles, couleurs/modèle, logo
 * d'établissement, texte à inscrire, date souhaitée de livraison,
 * observations. Toujours traité comme une demande de devis (grande
 * quantité) — pas de prix fixe affiché, l'équipe SHOP PRO revient vers le
 * responsable avec un tarif adapté.
 */
export default function CommandeGroupee() {
  const [etablissement, setEtablissement] = useState("");
  const [filiere, setFiliere] = useState("");
  const [responsableNom, setResponsableNom] = useState("");
  const [responsableContact, setResponsableContact] = useState("");
  const [typeTenue, setTypeTenue] = useState<TypeTenue>("tp");
  const [nombrePersonnes, setNombrePersonnes] = useState("");
  const [repartitionTailles, setRepartitionTailles] = useState<Record<string, string>>({});
  const [couleurs, setCouleurs] = useState("");
  const [logo, setLogo] = useState<UploadResult | null>(null);
  const [texteInscrire, setTexteInscrire] = useState("");
  const [dateLivraison, setDateLivraison] = useState("");
  const [observations, setObservations] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  function setTailleCount(size: string, value: string) {
    setRepartitionTailles((r) => ({ ...r, [size]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!etablissement.trim() || !responsableNom.trim() || !responsableContact.trim() || !nombrePersonnes.trim()) {
      setError("Établissement, responsable, contact et nombre de personnes sont requis.");
      return;
    }

    setSubmitting(true);
    try {
      const repartition = Object.entries(repartitionTailles)
        .filter(([, v]) => v && Number(v) > 0)
        .map(([size, v]) => `${size}: ${v}`)
        .join(", ");

      const notes = [
        "COMMANDE GROUPÉE ÉTABLISSEMENT — DEMANDE DE DEVIS",
        `Établissement : ${etablissement.trim()}`,
        filiere.trim() && `Filière/classe/promotion : ${filiere.trim()}`,
        `Type de tenue : ${KIND_LABEL[typeTenue]}`,
        `Nombre de personnes : ${nombrePersonnes.trim()}`,
        repartition && `Répartition des tailles : ${repartition}`,
        couleurs.trim() && `Couleurs/modèle souhaités : ${couleurs.trim()}`,
        texteInscrire.trim() && `Texte à inscrire : ${texteInscrire.trim()}`,
        logo && `Logo d'établissement joint : ${logo.url}`,
        dateLivraison && `Date de livraison souhaitée : ${dateLivraison}`,
        observations.trim() && `Observations : ${observations.trim()}`,
      ]
        .filter(Boolean)
        .join(" — ");

      const created = await createOrder({
        customer_name: `${responsableNom.trim()} — ${etablissement.trim()}`,
        customer_phone: responsableContact.trim(),
        total_amount: 0, // sur devis — le montant sera communiqué par l'équipe SHOP PRO
        notes,
      });
      setOrder(created);
    } catch (err: any) {
      setError(err?.message || "Échec de l'envoi de la demande. Réessayez dans un instant.");
    } finally {
      setSubmitting(false);
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy-800 text-ice-100">
          <IconCheck size={26} className="check-path" />
        </span>
        <h1 className="font-display mt-6 text-4xl font-bold text-navy-900">Demande de devis envoyée</h1>
        <p className="mt-4 text-navy-600">
          Référence <span className="font-semibold text-volt-600">{order.order_number || order.id}</span> —
          notre équipe reviendra vers {responsableNom} au {responsableContact} avec un devis adapté à votre
          établissement.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
              `Bonjour, je viens d'envoyer une demande de commande groupée (${order.order_number || order.id}) pour ${etablissement}.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-[#1f8f52] px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-ice-50 transition-colors hover:bg-[#1a7a46]"
          >
            <IconWhatsApp size={16} /> Confirmer sur WhatsApp
          </a>
          <Link to="/" className="btn-ghost">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
      <Reveal>
        <span className="mb-4 inline-grid h-14 w-14 place-items-center rounded-full bg-navy-800 text-ice-100">
          <IconSchool size={26} />
        </span>
        <p className="eyebrow">Écoles & centres de formation</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">Commande groupée établissement</h1>
        <p className="mt-4 max-w-2xl text-navy-600">
          Équipez toute une classe, une promotion ou un établissement en une
          seule demande. Décrivez votre besoin ci-dessous — nous revenons vers
          vous avec un devis adapté à la quantité.
        </p>
      </Reveal>

      <form onSubmit={onSubmit} className="mt-12 space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="etablissement">Nom de l'établissement</label>
            <input
              id="etablissement"
              className="field"
              value={etablissement}
              onChange={(e) => setEtablissement(e.target.value)}
              placeholder="Ex : ENSETP, Lycée technique..."
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="filiere">Filière / classe / promotion</label>
            <input
              id="filiere"
              className="field"
              value={filiere}
              onChange={(e) => setFiliere(e.target.value)}
              placeholder="Ex : Génie Mécanique — Promotion 2026"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="responsableNom">Nom du responsable</label>
            <input
              id="responsableNom"
              className="field"
              value={responsableNom}
              onChange={(e) => setResponsableNom(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="responsableContact">Contact du responsable (téléphone)</label>
            <input
              id="responsableContact"
              className="field"
              value={responsableContact}
              onChange={(e) => setResponsableContact(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="typeTenue">Type de tenue</label>
            <select
              id="typeTenue"
              className="field"
              value={typeTenue}
              onChange={(e) => setTypeTenue(e.target.value as TypeTenue)}
            >
              {(["tp", "blouson", "lacoste", "etablissement", "autre"] as TypeTenue[]).map((k) => (
                <option key={k} value={k}>{KIND_LABEL[k]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="nombrePersonnes">Nombre de personnes</label>
            <input
              id="nombrePersonnes"
              type="number"
              min={1}
              className="field"
              value={nombrePersonnes}
              onChange={(e) => setNombrePersonnes(e.target.value)}
              placeholder="Ex : 45"
              required
            />
          </div>
        </div>

        <div>
          <p className="label">Répartition des tailles (nombre de personnes par taille)</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {SIZES.map((s) => (
              <div key={s}>
                <label className="mb-1 block text-[11px] text-navy-500" htmlFor={`taille-${s}`}>{s}</label>
                <input
                  id={`taille-${s}`}
                  type="number"
                  min={0}
                  className="field"
                  value={repartitionTailles[s] || ""}
                  onChange={(e) => setTailleCount(s, e.target.value)}
                  placeholder="0"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="couleurs">Couleurs / modèle souhaités</label>
          <input
            id="couleurs"
            className="field"
            value={couleurs}
            onChange={(e) => setCouleurs(e.target.value)}
            placeholder="Ex : Bleu marine et blanc, bandes réfléchissantes"
          />
        </div>

        <div>
          <label className="label" htmlFor="texteInscrire">Texte à inscrire (nom d'école, devise...)</label>
          <input
            id="texteInscrire"
            className="field"
            value={texteInscrire}
            onChange={(e) => setTexteInscrire(e.target.value)}
          />
        </div>

        <PhotoUploadPlain
          label="Logo de l'établissement"
          hint="Votre logo est envoyé tel quel, sans filigrane — format image ou PDF, max 25 Mo."
          onUploaded={(result) => setLogo(result)}
        />

        <div>
          <label className="label" htmlFor="dateLivraison">Date souhaitée de livraison</label>
          <input
            id="dateLivraison"
            type="date"
            className="field"
            value={dateLivraison}
            onChange={(e) => setDateLivraison(e.target.value)}
          />
        </div>

        <div>
          <label className="label" htmlFor="observations">Observations</label>
          <textarea
            id="observations"
            className="field min-h-28 resize-y"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Toute précision utile pour votre commande groupée..."
          />
        </div>

        {error && <p className="text-sm text-volt-600">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? "Envoi en cours…" : "Demander un devis pour cette commande groupée"} <IconArrow size={16} />
        </button>
        <p className="text-center text-[11px] tracking-wide text-navy-500">
          Devis gratuit, sans engagement — réponse par téléphone ou WhatsApp
        </p>
      </form>
    </div>
  );
}
