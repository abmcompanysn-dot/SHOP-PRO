import { useRef, useState, type ChangeEvent } from "react";
import { fileToPreviewUrl } from "../lib/watermark";
import { uploadImage, type UploadResult } from "../services/abmcy";
import { IconCheck, IconUpload } from "./Icons";

type Props = {
  /** Appelé avec le résultat d'upload dès qu'un fichier est envoyé avec succès. */
  onUploaded: (result: UploadResult) => void;
  label?: string;
  hint?: string;
};

type Status = "idle" | "uploading" | "done" | "error";

/**
 * Champ d'upload pour le LOGO D'ÉTABLISSEMENT ou le fichier de
 * personnalisation fourni par un client dans un formulaire de commande ou
 * de devis (page Commander, CommandeGroupee). Envoie le fichier TEL QUEL,
 * sans filigrane : ce fichier appartient au client, pas à SHOP PRO — voir
 * la distinction explicite dans src/lib/watermark.ts. Pour les photos de
 * réalisations SHOP PRO (galerie), utiliser PhotoUploadWithWatermark.tsx.
 */
export default function PhotoUploadPlain({ onUploaded, label, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > 25 * 1024 * 1024) {
      setError("Ce fichier dépasse 25 Mo, la taille maximale autorisée.");
      setStatus("error");
      return;
    }

    try {
      setFileName(file.name);
      if (file.type.startsWith("image/")) {
        const previewUrl = await fileToPreviewUrl(file);
        setPreview(previewUrl);
      } else {
        setPreview(null);
      }

      setStatus("uploading");
      const result = await uploadImage(file);
      setStatus("done");
      onUploaded(result);
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Échec de l'envoi du fichier.");
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
        <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
        {preview ? (
          <img src={preview} alt="Aperçu du logo" className="mb-2 max-h-40 rounded-[4px] object-contain shadow-sm" />
        ) : (
          <IconUpload size={28} className="text-navy-500" />
        )}

        {status === "idle" && (
          <p className="text-sm text-navy-600">
            Cliquez pour joindre votre logo ou votre fichier de personnalisation (image ou PDF).
          </p>
        )}
        {status === "uploading" && <p className="text-sm text-navy-600">Envoi du fichier…</p>}
        {status === "done" && (
          <p className="flex items-center gap-2 text-sm font-medium text-navy-700">
            <IconCheck size={16} /> {fileName || "Fichier envoyé"}
          </p>
        )}
        {status === "error" && error && <p className="text-sm text-volt-600">{error}</p>}
      </label>
      {hint && <p className="mt-2 text-xs text-navy-500">{hint}</p>}
    </div>
  );
}
