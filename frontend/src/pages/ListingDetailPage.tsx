import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Use 'react-router-dom' for Vite
import { NavbarSecond } from "../components/NavbarSecond";
import { fetchListingById } from "../components/api";
import { 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel, 
  Settings2, 
  Car, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  Zap,
  ArrowLeft
} from "lucide-react";

// Base URL for images
const API_URL = "http://localhost:8000";

export const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");

  // Helper to get correct image URL (local or external)
  const getImageUrl = (src: string) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_URL}${src}`;
  };

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await fetchListingById(id);
        const data = res.data;
        setListing(data || null);
        
        // Set the first image as active immediately
        if (data?.images?.length) {
          setActiveImage(getImageUrl(data.images[0]));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-DE').format(value);
  };

  if (loading) return (
    <div className="min-h-screen bg-background grid place-items-center text-text-muted">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p>Loading machine...</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="min-h-screen bg-background grid place-items-center text-text-muted">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Listing Not Found</h2>
        <a href="/listings" className="text-primary hover:underline flex items-center justify-center gap-2">
           <ArrowLeft size={16}/> Back to Inventory
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-white font-sans pb-20">
      <NavbarSecond />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        
        {/* --- BREADCRUMB / BACK LINK --- */}
        <div className="mb-6">
            <a href="/listings" className="text-sm text-text-muted hover:text-white flex items-center gap-1 transition-colors w-fit">
                <ArrowLeft size={14} /> Back to Inventory
            </a>
        </div>

        {/* --- HEADER SECTION --- */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <span className="bg-secondary/20 text-secondary border border-secondary/20 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">
                    {listing.condition || "Used"}
                </span>
                <span className="text-text-muted text-sm flex items-center gap-1">
                    <MapPin size={14} /> {listing.location || "Slovenia"}
                </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              {listing.brand} {listing.model} <span className="text-text-muted font-normal">{listing.trim}</span>
            </h1>
          </div>
          
          <div className="text-left md:text-right bg-surface p-4 rounded-xl border border-white/10 shadow-xl min-w-[200px]">
            <p className="text-xs text-text-muted uppercase font-bold mb-1">Asking Price</p>
            <p className="text-3xl font-black text-primary">{formatCurrency(listing.price)}</p>
            {listing.isNegotiable && <p className="text-xs text-green-400 font-bold uppercase mt-1 flex items-center justify-end gap-1"><CheckCircle2 size={10}/> Negotiable</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- LEFT COLUMN: Visuals & Description --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* GALLERY */}
            <div className="space-y-4">
              <div className="aspect-video w-full bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                {activeImage ? (
                  <img src={activeImage} alt="Car" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-text-muted">No Images Available</div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  {listing.status || "Active"}
                </div>
              </div>

              {/* Thumbnails */}
              {listing.images && listing.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {listing.images.map((src: string, idx: number) => {
                    const fullSrc = getImageUrl(src);
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(fullSrc)}
                        className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === fullSrc 
                          ? "border-primary opacity-100 scale-105 shadow-lg shadow-primary/20" 
                          : "border-transparent opacity-50 hover:opacity-100 hover:border-white/20"
                        }`}
                      >
                        <img src={fullSrc} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* QUICK STATS GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Year", value: listing.year, icon: <Calendar size={18}/> },
                { label: "Mileage", value: `${formatNumber(listing.milage)} km`, icon: <Gauge size={18}/> },
                { label: "Gearbox", value: listing.gearbox, icon: <Settings2 size={18}/> },
                { label: "Fuel", value: listing.fuelType, icon: <Fuel size={18}/> },
              ].map((stat, i) => (
                  <div key={i} className="bg-surface p-4 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                      <div className="text-primary mb-2 bg-primary/10 p-2 rounded-lg">{stat.icon}</div>
                      <p className="text-xs text-text-muted uppercase font-bold">{stat.label}</p>
                      <p className="font-bold text-white text-lg">{stat.value}</p>
                  </div>
              ))}
            </div>

            {/* DESCRIPTION CARD */}
            <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Info size={22} className="text-primary"/> Vehicle Description
              </h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                {listing.description || <span className="italic text-text-muted">No description provided by seller.</span>}
              </div>
            </div>

            {/* FEATURES CARD */}
            <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Zap size={22} className="text-secondary"/> Features & Equipment
              </h2>
              {listing.features && listing.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {listing.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-gray-300 p-2 rounded-lg hover:bg-white/5 transition-colors">
                      <CheckCircle2 size={18} className="text-secondary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted italic text-center py-4 border border-dashed border-white/10 rounded-xl">No specific features listed.</p>
              )}
            </div>
          </div>

          {/* --- RIGHT COLUMN: Contact & Technical Data --- */}
          <div className="space-y-6">
            
            {/* SELLER CARD */}
            <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-900 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {listing.sellerId ? listing.sellerId[0].toUpperCase() : "S"}
                </div>
                <div>
                  <p className="font-bold text-white text-lg">Private Seller</p>
                  <p className="text-xs text-text-muted uppercase tracking-wider">Verified Member</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 transform hover:scale-[1.02]">
                    Show Phone Number
                </button>
                <button className="w-full bg-transparent border-2 border-white/10 text-white hover:bg-white/5 font-bold py-4 rounded-xl transition-all">
                    Send Message
                </button>
              </div>
              
              <p className="text-xs text-center text-text-muted mt-4 px-4">
                Please mention <strong className="text-white">DriveX</strong> when contacting the seller.
              </p>
            </div>

            {/* TECH SPECS TABLE */}
            <div className="bg-surface p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-white">
                <Car size={20} className="text-text-muted" /> Technical Data
              </h3>
              <div className="space-y-0 divide-y divide-white/5 text-sm">
                 {[
                    { label: "Body Type", val: listing.bodyType },
                    { label: "Drive Type", val: listing.driveType },
                    { label: "Power", val: `${listing.hp} HP / ${listing.kW} kW` },
                    { label: "Engine Size", val: `${listing.engineDisplacement} ccm` },
                    { label: "Doors / Seats", val: `${listing.doors} / ${listing.seats}` },
                    { label: "Emission Class", val: listing.euroStandard },
                 ].map((row, i) => (
                    <div key={i} className="flex justify-between py-3 first:pt-0">
                        <span className="text-text-muted">{row.label}</span>
                        <span className="font-medium text-white">{row.val || "—"}</span>
                    </div>
                 ))}
                 
                 <div className="flex justify-between py-3 pt-4 mt-2 bg-black/20 -mx-6 px-6 border-t border-white/5">
                  <span className="text-text-muted flex items-center gap-1 text-xs uppercase font-bold tracking-wider">
                    <ShieldCheck size={14}/> VIN Number
                  </span>
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                    {listing.vin || "HIDDEN"}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};