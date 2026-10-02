import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

/**
 * Génère un QR code pointant vers l'URL fournie, entièrement côté client
 * (aucun appel à un service tiers). Affiche aussi un bouton pour
 * télécharger le QR code en PNG — utile à imprimer et coller sur un flyer
 * ou une affiche d'établissement.
 */
export default function QRCodeCard({ url, label }: { url: string; label?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, url, { width: 200, margin: 2 }, (err) => {
      if (err) setError("Impossible de générer le QR code.");
    });
  }, [url]);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "shop-pro-qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-2xl border border-ice-300 bg-ice-50 p-6">
      {label && <p className="text-sm font-medium text-navy-700">{label}</p>}
      {error ? (
        <p className="text-sm text-volt-600">{error}</p>
      ) : (
        <canvas ref={canvasRef} className="rounded-lg" />
      )}
      <button
        type="button"
        onClick={handleDownload}
        className="rounded-full border border-navy-300 px-4 py-2 text-xs font-medium tracking-wide text-navy-700 uppercase transition-colors hover:bg-navy-800 hover:text-ice-100"
      >
        Télécharger le QR code
      </button>
    </div>
  );
}
