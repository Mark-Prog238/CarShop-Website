import { Link } from "react-router-dom";
import { MapPin, Fuel, Settings2, Gauge } from "lucide-react";

// Uporabi BASE_URL iz api.ts za slike
const BACKEND_BASE_URL = "http://localhost:8000"; 

// TIP: Minimalna definicija tipa, da TS ve, kaj delamo
type Listing = {
  _id: string | { $oid: string };
  brand: string;
  model: string;
  year: number;
  price: number;
  milage: number;
  fuelType: string;
  gearbox: string;
  images: string[];
  location?: string;
};

export const ListingCard = ({ listing }: { listing: Listing }) => {
  const title = `${listing.brand || ""} ${listing.model || ""}`.trim();
  const image = listing.images?.[0];
  
  // Pridobitev ID-ja
  const idStr = typeof listing._id === "string" ? listing._id : listing._id?.$oid || "";

  // Sestavljanje URL-ja slike (dodamo base URL backenda, če je slika lokalna)
  const imageUrl = image?.startsWith("http") ? image : `${BACKEND_BASE_URL}${image}`;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(value);
  };
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-DE').format(value);
  };

  return (
    <Link 
      to={`/listing/${idStr}`} 
      className="block rounded-xl overflow-hidden bg-surface text-white hover:-translate-y-1 transition-transform border border-white/10 shadow-lg group"
    >
      {/* Slika */}
      <div className="aspect-video bg-black/30 relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-text-muted">No image</div>
        )}
      </div>

      {/* Podatki */}
      <div className="p-4 space-y-2">
        <h3 className="font-extrabold text-white text-xl tracking-tight leading-tight group-hover:text-primary transition-colors">
          {title || "Unknown"}
        </h3>
        <p className="text-sm text-text-muted">
          {listing.year || "—"} • {listing.milage ? `${formatNumber(listing.milage)} km` : "—"}
        </p>

        {/* CENA */}
        {listing.price != null && (
          <p className="pt-1 font-black text-2xl text-secondary">
            {formatCurrency(listing.price)}
          </p>
        )}
        
        {/* HITRI PODATKI */}
        <div className="flex items-center justify-between text-xs text-text-muted pt-2 border-t border-white/5">
            <span className="flex items-center gap-1">
                <Fuel size={14} className="text-primary"/> {listing.fuelType || '—'}
            </span>
            <span className="flex items-center gap-1">
                <Settings2 size={14} className="text-primary"/> {listing.gearbox || '—'}
            </span>
        </div>
      </div>
    </Link>
  );
};