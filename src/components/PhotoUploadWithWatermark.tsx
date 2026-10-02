import { useRef, useState, type ChangeEvent } from "react";
import { applyWatermark, fileToPreviewUrl } from "../lib/watermark";
import { uploadImage, type UploadResult } from "../services/abmcy";
import { IconCheck, IconUpload } from "./Icons";

type Props = {
  /** Appelé avec le résultat d'upload dès qu'une photo filigranée est envoyée avec succès. */
  onUploaded: (result: UploadResult) => void;
  label?: string;
  hint?: string;
};

type Status = "idle" | "processing" | "uploading" | "done" | "error";

/**
 * Champ d'upload réutilisable pour les photos de RÉALISATIONS SHOP PRO
 * uniquement : sélection d'une photo -> filigrane "SHOP PRO" apposé côté
 * client (canvas, voir src/lib/watermark.ts) -> upload vers le backend ABMCY
 * (POST /uploads/image, 25 Mo max).
 *
 * Ne pas utiliser ce composant pour un logo/fichier fourni par un client
 * dans un formulaire de commande/devis — voir PhotoUploadPlain.tsx pour ce
 * cas-là (aucun filigrane, le fichier appartient au client).
 */
export default function PhotoUploadWithWatermark({ onUploaded, label, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > 25 * 1024 * 1024) {
      setError("Cette photo dépasse 25 Mo, la taille maximale autorisée.");
      setStatus("error");
      return;
    }

    try {
      setStatus("processing");
      const watermarked = await applyWatermark(file);
      const previewUrl = await fileToPreviewUrl(watermarked);
      setPreview(previewUrl);

      setStatus("uploading");
      const result = await uploadImage(watermarked);
      setStatus("done");
      onUploaded(result);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Échec de l'envoi de la photo.");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      {label && <p className="label">{label}</p>}
      <label
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[6px] border-2 border-dashed px-6 py-10 text-center transition-colors duration-300 ${
          status === "error"
            ? "border-volt-500/60 bg-volt-300/10"
            : "border-ice-300 bg-ice-50/60 hover:border-volt-500"
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {preview ? (
          <img
            src={preview}
            alt="Aperçu avec filigrane SHOP PRO"
            className="mb-2 max-h-56 rounded-[4px] object-cover shadow-sm"
          />
        ) : (
          <IconUpload size={28} className="text-navy-500" />
        )}

        {status === "idle" && (
          <p className="text-sm text-navy-600">
            Cliquez pour choisir une photo — un filigrane « SHOP PRO » sera ajouté
            automatiquement avant l'envoi.
          </p>
        )}
        {status === "processing" && <p className="text-sm text-navy-600">Ajout du filigrane…</p>}
        {status === "uploading" && <p className="text-sm text-navy-600">Envoi de la photo…</p>}
        {status === "done" && (
          <p className="flex items-center gap-2 text-sm font-medium text-navy-700">
            <IconCheck size={16} /> Photo envoyée avec filigrane
          </p>
        )}
        {status === "error" && error && <p className="text-sm text-volt-600">{error}</p>}
      </label>
      {hint && <p className="mt-2 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}
