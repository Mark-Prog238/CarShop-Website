import { Link } from "react-router";

type Listing = {
  _id: any;
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  images?: string[];
};

export const ListingCard = ({ listing }: { listing: Listing }) => {
  const title = `${listing.brand || ""} ${listing.model || ""}`.trim();
  const image = listing.images?.[0];
  const idStr = typeof listing._id === "string" ? listing._id : listing._id?.$oid || "";
  return (
    <Link to={`/listing/${idStr}`} className="block rounded-xl overflow-hidden bg-buttonBg hover:translate-y-[-2px] transition-transform">
      <div className="aspect-video bg-black/30">
        {image ? (
          <img src={image} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full grid place-items-center text-white/60">No image</div>
        )}
      </div>
      <div className="p-3 text-white">
        <h3 className="font-semibold text-white/90">{title || "Unknown"}</h3>
        <p className="text-sm text-white/70">{listing.year || "—"}</p>
        {listing.price != null && (
          <p className="pt-1 font-bold">€ {listing.price.toLocaleString()}</p>
        )}
      </div>
    </Link>
  );
};


