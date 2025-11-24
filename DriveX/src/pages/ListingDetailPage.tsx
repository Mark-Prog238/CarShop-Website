import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { NavbarSecond } from "../components/NavbarSecond";
import { fetchListingById } from "../components/api";
import API from "../components/api"; 
import { 
  MapPin, Calendar, Gauge, Fuel, Car, CheckCircle2, Info, 
  ShieldCheck, Zap, ArrowLeft, Phone, Heart, Loader2
} from "lucide-react";

const API_URL = API.BASE_URL; 

// Helper za dekodiranje ID-ja iz tokena
const getUserId = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
    } catch { return null; }
};

export const ListingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [sellerPhone, setSellerPhone] = useState<string | null>(null); 
  const [phoneLoading, setPhoneLoading] = useState(false);
  
  // Like State
  const [isLiked, setIsLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const getImageUrl = (src: string) => {
    if (!src) return "";
    return src.startsWith("http") ? src : `${API_URL}${src}`; 
  };

  // 1. Naloži podatke o oglasu
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await fetchListingById(id);
        setListing(res.data || null);
        if (res.data?.images?.length) {
          setActiveImage(getImageUrl(res.data.images[0]));
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // 2. Preveri, če je oglas že lajkan (ko se naloži)
  useEffect(() => {
      const userId = getUserId();
      const token = localStorage.getItem("jwtToken");
      if (userId && id && token) {
          fetch(`${API_URL}/api/users/${userId}`, {
              headers: { "Authorization": `Bearer ${token}` }
          })
          .then(r => r.json())
          .then(data => {
              // Preveri, če je ID oglasa v seznamu savedListings
              if (data.savedListings && data.savedListings.includes(id)) {
                  setIsLiked(true);
              }
          })
          .catch(e => console.error("Failed to check likes", e));
      }
  }, [id]);

  // 3. Funkcija za Like/Unlike
  const handleToggleLike = async () => {
      const userId = getUserId();
      const token = localStorage.getItem("jwtToken");
      
      if (!userId || !token) { 
          navigate("/login"); 
          return; 
      } 
      
      setLikeLoading(true);
      try {
          const res = await fetch(`${API_URL}/api/users/${userId}/likes`, {
              method: "POST",
              headers: { 
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}` 
              },
              body: JSON.stringify({ listingId: id })
          });
          const data = await res.json();
          if (data.success) {
              setIsLiked(data.isLiked); // Backend vrne novo stanje (true/false)
          }
      } catch (e) {
          console.error("Like failed", e);
      } finally {
          setLikeLoading(false);
      }
  };

const handleShowPhone = async () => {
    if (!id || sellerPhone || phoneLoading) return;
    setPhoneLoading(true);
    try {
        const res = await fetch(`${API_URL}/api/listings/${id}/contact`);
        const json = await res.json();
        if (json.success && json.phone) {
            setSellerPhone(json.phone);
        } else {
            setSellerPhone("N/A - Ni telefona");
        }
    } catch (e) {
        setSellerPhone("Napaka pri povezavi");
    } finally {
        setPhoneLoading(false);
    }
  };
  const formatCurrency = (v: number) => new Intl.NumberFormat('en-DE', { 
    style: 'currency', 
    currency: 'EUR',
    maximumFractionDigits: 0, // To odstrani cente (decimalke)
    minimumFractionDigits: 0  // To zagotovi, da se ne dodajo nule, če je celo število
  }).format(v);
  const formatNumber = (v: number) => new Intl.NumberFormat('en-DE').format(v);

  if (loading) return <div className="min-h-screen bg-background grid place-items-center text-text-muted"><Loader2 className="animate-spin"/></div>;
  if (!listing) return <div className="min-h-screen bg-background grid place-items-center text-white">Listing Not Found</div>;

  // Pripravimo specifikacije za tabelo
  const spec = {
    bodyType: listing.bodyType || "—",
    driveType: listing.driveType || "—",
    hp: listing.hp || "—",
    kW: listing.kW || "—",
    vin: listing.vin,
    features: listing.features || [],
    doors: listing.doors || "—",
    seats: listing.seats || "—",
    euroStandard: listing.euroStandard || "—"
  };

  return (
    <div className="min-h-screen bg-background text-white font-sans pb-20">
      <NavbarSecond />
      
      <main className="mx-auto max-w-7xl px-4 py-8">
        
        {/* --- BREADCRUMB --- */}
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
          
          {/* --- LEFT COLUMN --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* GALLERY */}
            <div className="space-y-4">
              <div className="aspect-video w-full bg-black/50 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                {activeImage ? (
                  <img src={activeImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full grid place-items-center text-text-muted">No Images Available</div>
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  {listing.status || "Active"}
                </div>
              </div>
              {/* THUMBNAILS */}
              {listing.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {listing.images.map((src: string, idx: number) => (
                    <button key={idx} onClick={() => setActiveImage(getImageUrl(src))} className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === getImageUrl(src) ? "border-primary opacity-100 scale-105" : "border-transparent opacity-50 hover:opacity-100"}`}>
                        <img src={getImageUrl(src)} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Body", value: spec.bodyType, icon: <Car size={18}/> },
                { label: "Year", value: listing.year, icon: <Calendar size={18}/> },
                { label: "Mileage", value: `${formatNumber(listing.milage)} km`, icon: <Gauge size={18}/> },
                { label: "Fuel", value: listing.fuelType, icon: <Fuel size={18}/> },
              ].map((stat, i) => (
                  <div key={i} className="bg-surface p-4 rounded-xl border border-white/5 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
                      <div className="text-primary mb-2 bg-primary/10 p-2 rounded-lg">{stat.icon}</div>
                      <p className="text-xs text-text-muted uppercase font-bold">{stat.label}</p>
                      <p className="font-bold text-white text-lg">{stat.value}</p>
                  </div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Info size={22} className="text-primary"/> Vehicle Description</h2>
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm md:text-base font-light">
                {listing.description || <span className="italic text-text-muted">No description provided.</span>}
              </div>
            </div>

            {/* FEATURES */}
            <div className="bg-surface p-8 rounded-2xl border border-white/10 shadow-lg">
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white"><Zap size={22} className="text-secondary"/> Features & Equipment</h2>
              {spec.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {spec.features.map((feature: string, i: number) => (
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

          {/* --- RIGHT COLUMN --- */}
          <div className="space-y-6">
            
            {/* SELLER & ACTIONS CARD */}
            <div className="bg-surface p-6 rounded-2xl border border-white/10 shadow-xl lg:sticky lg:top-24">
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
                {/* Phone Button */}
                {sellerPhone ? (
                    <div className="w-full bg-secondary text-white font-black text-center py-4 rounded-xl text-lg animate-in fade-in flex items-center justify-center gap-2"><Phone size={18}/> {sellerPhone}</div>
                ) : phoneLoading ? (
                    <button disabled className="w-full bg-primary/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"><Loader2 className="animate-spin"/> Loading...</button>
                ) : (
                    <button onClick={handleShowPhone} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg">Show Phone Number</button>
                )}
                
                {/* LIKE BUTTON (Namesto Send Message) */}
                <button 
                    onClick={handleToggleLike}
                    disabled={likeLoading}
                    className={`w-full border-2 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${isLiked ? "bg-white text-black border-white" : "border-white/10 text-white hover:bg-white/5"}`}
                >
                    <Heart size={20} className={isLiked ? "fill-red-500 text-red-500" : ""} />
                    {isLiked ? "Saved" : "Save to Favorites"}
                </button>
              </div>
              
              <p className="text-xs text-center text-text-muted mt-4 px-4">Please mention <strong className="text-white">DriveX</strong> when contacting the seller.</p>
            </div>

            {/* TECH SPECS TABLE */}
            <div className="bg-surface p-6 rounded-2xl border border-white/10">
              <h3 className="text-lg font-bold mb-5 flex items-center gap-2 text-white"><Car size={20} className="text-text-muted" /> Technical Data</h3>
              <div className="space-y-0 divide-y divide-white/5 text-sm">
                 {[
                    { label: "Body Type", val: spec.bodyType },
                    { label: "Drive Type", val: spec.driveType },
                    { label: "Power", val: `${spec.hp} HP / ${spec.kW} kW` },
                    { label: "Doors / Seats", val: `${spec.doors} / ${spec.seats}` },
                    { label: "Emission Class", val: spec.euroStandard },
                 ].map((row, i) => (
                    <div key={i} className="flex justify-between py-3 first:pt-0">
                        <span className="text-text-muted">{row.label}</span>
                        <span className="font-medium text-white">{row.val}</span>
                    </div>
                 ))}
                 <div className="flex justify-between py-3 pt-4 mt-2 bg-black/20 -mx-6 px-6 border-t border-white/5">
                  <span className="text-text-muted flex items-center gap-1 text-xs uppercase font-bold tracking-wider"><ShieldCheck size={14}/> VIN</span>
                  <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">{spec.vin || "HIDDEN"}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};