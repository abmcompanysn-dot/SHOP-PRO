/**
 * Filigrane "SHOP PRO" apposé côté client, AVANT l'upload vers le backend
 * ABMCY (POST /uploads/image, voir src/services/abmcy.ts).
 *
 * Pourquoi côté client plutôt que côté serveur : le backend ABMCY Core est un
 * modulith générique partagé par tous les tenants (voir C:\Users\Admin\abmcycors)
 * et ne connaît rien de la marque "SHOP PRO" — on ne le modifie pas. Le
 * filigrane est donc dessiné dans un <canvas> HTML5 dans le navigateur de la
 * personne qui publie la photo, puis le canvas est reconverti en fichier
 * avant d'être envoyé à uploadImage().
 *
 * IMPORTANT — à utiliser UNIQUEMENT pour les photos de réalisations SHOP PRO
 * (galerie "Nos réalisations"). Ne JAMAIS appliquer ce filigrane au logo ou
 * au fichier de personnalisation fourni par un client dans un formulaire de
 * commande/devis — ce fichier appartient au client, pas à SHOP PRO (voir
 * uploadImage() dans services/abmcy.ts, utilisé tel quel pour ces cas-là).
 *
 * Usage typique (galerie uniquement) :
 *
 *   const original = fileInput.files[0];
 *   const watermarked = await applyWatermark(original);
 *   const result = await uploadImage(watermarked);
 */

export type WatermarkOptions = {
  /** Texte affiché en filigrane. Par défaut : "SHOP PRO". */
  text?: string;
  /** Coin d'ancrage du filigrane. */
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";
  /** Opacité du filigrane (0 à 1). */
  opacity?: number;
  /** Qualité JPEG de sortie (0 à 1), si le format de sortie est jpeg. */
  quality?: number;
};

const DEFAULTS: Required<WatermarkOptions> = {
  text: "SHOP PRO",
  position: "bottom-right",
  opacity: 0.8,
  quality: 0.92,
};

/**
 * Charge un fichier image dans un HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de charger l'image sélectionnée."));
    };
    img.src = url;
  });
}

/**
 * Dessine le filigrane (logo texte + petit sceau) sur un contexte canvas déjà
 * dimensionné à la taille de l'image.
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  opts: Required<WatermarkOptions>
) {
  const scale = Math.max(width, height) / 1600; // adapte la taille du texte à la résolution
  const fontSize = Math.max(16, Math.round(28 * scale));
  const padding = Math.max(14, Math.round(24 * scale));
  const label = opts.text;

  ctx.save();
  ctx.font = `700 ${fontSize}px "Inter", "Segoe UI", sans-serif`;
  ctx.textBaseline = "alphabetic";
  const metrics = ctx.measureText(label);
  const textWidth = metrics.width;
  const boxPaddingX = fontSize * 0.6;
  const boxPaddingY = fontSize * 0.45;
  const boxWidth = textWidth + boxPaddingX * 2;
  const boxHeight = fontSize + boxPaddingY * 2;

  let x = padding;
  let y = padding;
  switch (opts.position) {
    case "bottom-right":
      x = width - boxWidth - padding;
      y = height - boxHeight - padding;
      break;
    case "bottom-left":
      x = padding;
      y = height - boxHeight - padding;
      break;
    case "top-right":
      x = width - boxWidth - padding;
      y = padding;
      break;
    case "top-left":
      x = padding;
      y = padding;
      break;
    case "center":
      x = (width - boxWidth) / 2;
      y = (height - boxHeight) / 2;
      break;
  }

  // fond semi-transparent (navy-900) derrière le texte pour la lisibilité sur toute photo
  ctx.globalAlpha = opts.opacity;
  ctx.fillStyle = "rgba(9, 28, 61, 0.6)";
  const radius = 6 * scale;
  roundRect(ctx, x, y, boxWidth, boxHeight, radius);
  ctx.fill();

  // petit sceau (losange bleu électrique) avant le texte
  const sealSize = fontSize * 0.55;
  const sealCx = x + boxPaddingX * 0.55;
  const sealCy = y + boxHeight / 2;
  ctx.fillStyle = "#0d6efd";
  ctx.beginPath();
  ctx.moveTo(sealCx, sealCy - sealSize / 2);
  ctx.lineTo(sealCx + sealSize / 2, sealCy);
  ctx.lineTo(sealCx, sealCy + sealSize / 2);
  ctx.lineTo(sealCx - sealSize / 2, sealCy);
  ctx.closePath();
  ctx.fill();

  // texte
  ctx.globalAlpha = Math.min(1, opts.opacity + 0.15);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, x + boxPaddingX + sealSize * 0.9, y + boxHeight - boxPaddingY - fontSize * 0.18);

  ctx.restore();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Applique le filigrane "SHOP PRO" à un fichier image et retourne un
 * nouveau File (même nom, contenu réencodé) prêt à être envoyé à
 * uploadImage(). Ne modifie jamais le fichier original.
 */
export async function applyWatermark(
  file: File,
  options: WatermarkOptions = {}
): Promise<File> {
  const opts = { ...DEFAULTS, ...options };

  if (!file.type.startsWith("image/")) {
    throw new Error("Le fichier sélectionné n'est pas une image.");
  }

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Le navigateur ne permet pas de traiter l'image (canvas indisponible).");
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  drawWatermark(ctx, canvas.width, canvas.height, opts);

  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, opts.quality)
  );

  if (!blob) {
    throw new Error("Échec de la génération de l'image filigranée.");
  }

  const watermarkedName = withWatermarkSuffix(file.name, outputType);
  return new File([blob], watermarkedName, { type: outputType, lastModified: Date.now() });
}

function withWatermarkSuffix(originalName: string, mimeType: string): string {
  const ext = mimeType === "image/png" ? "png" : "jpg";
  const base = originalName.replace(/\.[^./\\]+$/, "");
  return `${base || "photo"}-shop-pro.${ext}`;
}

/**
 * Génère un aperçu (data URL) d'un fichier, pour affichage immédiat dans le
 * formulaire avant/après upload.
 */
export function fileToPreviewUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Impossible de lire le fichier."));
    reader.readAsDataURL(file);
  });
}
