import { Link } from "react-router-dom";
import { fmtPrice, KIND_LABEL, type Listing } from "../data/catalog";
import { Reveal } from "./Reveal";
import { IconArrow } from "./Icons";

export default function ListingCard({
  listing,
  delay = 0,
}: {
  listing: Listing;
  delay?: number;
}) {
  const detailPath = `/produits/${listing.id}`;

  return (
    <Reveal delay={delay} className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-[8px] border border-ice-300 bg-ice-200">
        <Link to={detailPath} className="block aspect-[4/3] overflow-hidden">
          <img
            src={listing.image}
            alt={listing.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            style={{ objectPosition: listing.objectPos }}
          />
        </Link>

        {/* badges */}
        <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.isNew && (
            <span className="bg-volt-500 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ice-50">
              Nouveau
            </span>
          )}
          {listing.isBest && (
            <span className="bg-navy-800/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-ice-100">
              Populaire
            </span>
          )}
        </div>

        <Link
          to={detailPath}
          className="absolute right-3 bottom-3 left-3 flex items-center justify-center gap-2.5 bg-navy-900/95 py-3.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ice-100 backdrop-blur-sm transition-all duration-400 ease-out hover:bg-volt-600 md:translate-y-[120%] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
        >
          Voir le produit <IconArrow size={15} />
        </Link>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-navy-500">
          {KIND_LABEL[listing.kind]}
        </p>
        <Link
          to={detailPath}
          className="font-display mt-1 text-xl leading-snug font-semibold text-navy-900 transition-colors hover:text-volt-600"
        >
          {listing.name}
        </Link>
        <p className="mt-1 text-[15px] font-bold text-volt-600">{fmtPrice(listing.price)}</p>

        {(listing.sizes.length > 0 || listing.colors.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ice-300/60 pt-3">
            {listing.colors.slice(0, 3).map((c) => (
              <span
                key={c}
                className="rounded-full border border-ice-300 px-2.5 py-1 text-[10.5px] text-navy-600"
              >
                {c}
              </span>
            ))}
            {listing.sizes.length > 0 && (
              <span className="text-[11px] text-navy-500">
                Tailles {listing.sizes[0]}–{listing.sizes[listing.sizes.length - 1]}
              </span>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}
