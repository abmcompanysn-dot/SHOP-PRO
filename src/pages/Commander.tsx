import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { fmtPrice, CONTACT } from "../data/catalog";
import { createOrder, type Order } from "../services/abmcy";
import { Reveal } from "../components/Reveal";
import { IconArrow, IconCheck, IconWhatsApp } from "../components/Icons";

/**
 * Page "Commande / Devis" — reprend les infos des articles choisis sur les
 * fiches produit (panier) + coordonnées client, avec un choix explicite
 * entre commande directe et demande de devis, et un récapitulatif avant
 * validation. Paiement en ligne non disponible en V1 (voir cahier des
 * charges section 19) : la confirmation de paiement se fait manuellement
 * après la commande (section 10) — espèces, Wave, Orange Money ou virement,
 * négocié directement avec l'équipe SHOP PRO.
 */
export default function Commander() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"commande" | "devis">("commande");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const hasQuoteItem = cart.some((i) => i.isQuote);

  if (cart.length === 0 && !order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p className="font-display text-3xl font-bold text-navy-900">Rien à commander pour l'instant</p>
        <p className="mt-4 text-navy-500">Choisissez un produit dans le catalogue avant de finaliser.</p>
        <Link to="/catalogue" className="btn-primary mt-8">Voir le catalogue</Link>
      </div>
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Le nom et le téléphone sont requis pour confirmer la commande.");
      return;
    }

    setSubmitting(true);
    try {
      const summary = cart
        .map((i) => {
          const parts = [`${i.qty}x ${i.name}`, i.detail, i.customization].filter(Boolean);
          return parts.join(" — ");
        })
        .join(" | ");
      const created = await createOrder({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim() || undefined,
        total_amount: hasQuoteItem ? 0 : cartTotal,
        shipping_address: whatsapp.trim() ? `WhatsApp : ${whatsapp.trim()}` : undefined,
        notes: [
          mode === "devis" ? "DEMANDE DE DEVIS" : "COMMANDE DIRECTE",
          summary,
          notes.trim(),
        ]
          .filter(Boolean)
          .join(" — "),
      });
      setOrder(created);
      clearCart();
    } catch (err: any) {
      setError(err?.message || "Échec de l'envoi de la commande. Réessayez dans un instant.");
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
        <h1 className="font-display mt-6 text-4xl font-bold text-navy-900">
          {mode === "devis" ? "Demande de devis envoyée" : "Commande enregistrée"}
        </h1>
        <p className="mt-4 text-navy-600">
          Référence <span className="font-semibold text-volt-600">{order.order_number || order.id}</span> —
          notre équipe vous contactera au {phone} pour {mode === "devis" ? "vous transmettre votre devis" : "confirmer les modalités et le paiement"}.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(
              `Bonjour, je viens d'envoyer la commande ${order.order_number || order.id} sur le site SHOP PRO.`
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
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8">
      <Reveal>
        <p className="eyebrow">Dernière étape</p>
        <h1 className="font-display mt-3 text-5xl font-bold text-navy-900">Finaliser votre commande</h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <p className="label">Vous souhaitez</p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMode("commande")}
                className={`chip ${mode === "commande" ? "chip-on" : ""}`}
              >
                Commander directement
              </button>
              <button
                type="button"
                onClick={() => setMode("devis")}
                className={`chip ${mode === "devis" ? "chip-on" : ""}`}
              >
                Demander un devis
              </button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="name">Nom complet</label>
              <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="label" htmlFor="phone">Téléphone</label>
              <input id="phone" className="field" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="whatsapp">WhatsApp (si différent du téléphone)</label>
            <input id="whatsapp" className="field" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="email">E-mail (optionnel)</label>
            <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="notes">Remarques (optionnel)</label>
            <textarea id="notes" className="field min-h-24 resize-y" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Délai souhaité, précisions de livraison..." />
          </div>

          {error && <p className="text-sm text-volt-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Envoi en cours…" : mode === "devis" ? "Envoyer la demande de devis" : "Confirmer la commande"} <IconArrow size={16} />
          </button>
          <p className="text-center text-[11px] tracking-wide text-navy-500">
            Paiement confirmé manuellement après la commande — espèces, Wave, Orange Money ou virement
          </p>
        </form>

        <aside className="h-fit rounded-[8px] border border-ice-300 bg-ice-50 p-6">
          <p className="eyebrow">Récapitulatif</p>
          <ul className="mt-4 space-y-4 divide-y divide-ice-300/60">
            {cart.map((item) => (
              <li key={item.key} className="pt-4 first:pt-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{item.name}</p>
                    {item.detail && <p className="text-xs text-navy-500">{item.detail}</p>}
                    <p className="text-xs text-navy-500">Quantité : {item.qty}</p>
                  </div>
                  <p className="text-sm font-semibold text-navy-900">
                    {item.isQuote ? "Sur devis" : fmtPrice(item.price * item.qty)}
                  </p>
                </div>
                {item.customization && (
                  <p className="mt-1 text-xs text-navy-500 italic">{item.customization}</p>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-baseline justify-between border-t border-ice-300/70 pt-4">
            <span className="text-[12px] font-semibold uppercase tracking-[0.22em] text-navy-700">
              {hasQuoteItem ? "Total estimé" : "Total"}
            </span>
            <span className="font-display text-2xl font-bold text-navy-900">
              {fmtPrice(cartTotal)}
              {hasQuoteItem && <span className="ml-1 text-sm font-normal text-navy-500">+ devis</span>}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
